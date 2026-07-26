/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { DUODUO_AI_MODEL, DUODUO_PUBLIC_SYSTEM_PROMPT } from "./duoduo-public-context";

interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AiBinding {
  run(model: string, input: {
    messages: AiMessage[];
    max_tokens?: number;
    temperature?: number;
  }): Promise<unknown>;
}

interface Env {
  ASSETS: Fetcher;
  AI: AiBinding;
  DB?: D1Database;
  ADMIN_TOKEN?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

const cleanPlainText = (value: unknown, maxLength: number) => String(value ?? "")
  .replace(/<[^>]*>/g, "")
  .replace(/[<>{}]/g, "")
  .replace(/\s+/g, " ")
  .trim()
  .slice(0, maxLength);

const containsUrl = (value: string) => /(https?:\/\/|www\.|[a-z0-9-]+\.(com|cn|net|org|io)\b)/i.test(value);

let visitorSchemaReady: Promise<void> | null = null;

function ensureVisitorSchema(db: D1Database) {
  visitorSchemaReady ??= db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS visitor_messages (
        id TEXT PRIMARY KEY NOT NULL,
        nickname TEXT NOT NULL,
        city TEXT,
        message TEXT NOT NULL,
        email TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        ip_hash TEXT NOT NULL,
        star_x INTEGER NOT NULL,
        star_y INTEGER NOT NULL,
        reply TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        moderated_at TEXT
      )`,
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS visitor_messages_status_created_idx ON visitor_messages (status, created_at)",
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS visitor_messages_ip_created_idx ON visitor_messages (ip_hash, created_at)",
    ),
  ]).then(() => undefined).catch((error) => {
    visitorSchemaReady = null;
    throw error;
  });
  return visitorSchemaReady;
}

async function hashVisitor(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function handleVisitorMessages(request: Request, env: Env) {
  if (!env.DB) {
    return Response.json(
      { error: "Visitor-light storage will be connected after preview approval." },
      { status: 503 },
    );
  }
  await ensureVisitorSchema(env.DB);

  if (request.method === "GET") {
    const result = await env.DB.prepare(
      `SELECT id, nickname, city, message, created_at AS date, reply, star_x AS x, star_y AS y
       FROM visitor_messages
       WHERE status = 'approved'
       ORDER BY created_at DESC
       LIMIT 40`,
    ).all();
    return Response.json({ messages: result.results ?? [] });
  }

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "GET, POST" } });
  }

  const body = await request.json() as Record<string, unknown>;
  if (cleanPlainText(body.website, 80)) return Response.json({ ok: true, status: "pending" }, { status: 202 });

  const nickname = cleanPlainText(body.nickname, 32);
  const city = cleanPlainText(body.city, 48);
  const message = cleanPlainText(body.message, 240);
  const email = cleanPlainText(body.email, 120).toLowerCase();
  const characterCount = Array.from(message).length;
  if (!nickname || characterCount < 5 || characterCount > 240) {
    return Response.json({ error: "Nickname and a 5–240 character message are required." }, { status: 400 });
  }
  if (containsUrl(message) || containsUrl(city) || containsUrl(nickname)) {
    return Response.json({ error: "Links are not accepted in visitor messages." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email." }, { status: 400 });
  }

  const clientAddress = request.headers.get("CF-Connecting-IP") ?? "local-preview";
  const ipHash = await hashVisitor(clientAddress);
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM visitor_messages WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')",
  ).bind(ipHash).first<{ count: number }>();
  if ((recent?.count ?? 0) >= 3) {
    return Response.json({ error: "Too many messages. Please wait for the next tide." }, { status: 429 });
  }

  const id = crypto.randomUUID();
  const starX = 12 + Math.round(Math.random() * 74);
  const starY = 12 + Math.round(Math.random() * 42);
  await env.DB.prepare(
    `INSERT INTO visitor_messages
      (id, nickname, city, message, email, status, ip_hash, star_x, star_y)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
  ).bind(id, nickname, city || null, message, email || null, ipHash, starX, starY).run();

  return Response.json({ ok: true, status: "pending" }, { status: 202 });
}

async function handleVisitorAdmin(request: Request, env: Env, url: URL) {
  if (!env.DB || !env.ADMIN_TOKEN) return Response.json({ error: "Admin moderation is not configured." }, { status: 503 });
  await ensureVisitorSchema(env.DB);
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || token !== env.ADMIN_TOKEN) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (request.method === "GET") {
    const result = await env.DB.prepare(
      `SELECT id, nickname, city, message, email, status, created_at, reply
       FROM visitor_messages ORDER BY created_at DESC LIMIT 100`,
    ).all();
    return Response.json({ messages: result.results ?? [] });
  }

  const id = url.pathname.split("/").pop();
  if (!id) return Response.json({ error: "Message id required" }, { status: 400 });
  if (request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM visitor_messages WHERE id = ?").bind(id).run();
    return Response.json({ ok: true });
  }
  if (request.method === "PATCH") {
    const body = await request.json() as { status?: string; reply?: string };
    if (!["approved", "rejected", "hidden"].includes(body.status ?? "")) {
      return Response.json({ error: "Invalid moderation status" }, { status: 400 });
    }
    const reply = cleanPlainText(body.reply, 240);
    await env.DB.prepare(
      "UPDATE visitor_messages SET status = ?, reply = ?, moderated_at = CURRENT_TIMESTAMP WHERE id = ?",
    ).bind(body.status, reply || null, id).run();
    return Response.json({ ok: true });
  }
  return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "GET, PATCH, DELETE" } });
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/visitor-messages") {
      try {
        return await handleVisitorMessages(request, env);
      } catch (error) {
        console.error("Visitor message request failed", error instanceof Error ? error.message : "Unknown error");
        return Response.json({ error: "Visitor messages are between tides." }, { status: 503 });
      }
    }

    if (url.pathname.startsWith("/api/admin/visitor-messages")) {
      try {
        return await handleVisitorAdmin(request, env, url);
      } catch (error) {
        console.error("Visitor moderation failed", error instanceof Error ? error.message : "Unknown error");
        return Response.json({ error: "Moderation request failed." }, { status: 503 });
      }
    }

    if (url.pathname === "/api/duoduo-ai") {
      if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
      }

      const origin = request.headers.get("Origin");
      const allowedOriginHosts = new Set([
        "faifaida.com",
        "www.faifaida.com",
        "localhost:3000",
        "127.0.0.1:3000",
      ]);
      let originHost = "";
      try {
        originHost = origin ? new URL(origin).host : "";
      } catch {
        return Response.json({ error: "Invalid request origin" }, { status: 400 });
      }
      const forwardedHost = request.headers.get("X-Forwarded-Host") ?? request.headers.get("Host") ?? url.host;
      if (origin && originHost !== forwardedHost && !allowedOriginHosts.has(originHost)) {
        return Response.json({ error: "Cross-origin request rejected" }, { status: 403 });
      }

      try {
        const body = await request.json() as { messages?: Array<{ role?: string; content?: string }> };
        const publicMessages: AiMessage[] = (body.messages ?? [])
          .filter((message) => (message.role === "user" || message.role === "assistant") && typeof message.content === "string")
          .slice(-8)
          .map((message) => ({
            role: message.role as "user" | "assistant",
            content: message.content!.trim().slice(0, 900),
          }))
          .filter((message) => message.content.length > 0);

        if (!publicMessages.length || publicMessages[publicMessages.length - 1].role !== "user") {
          return Response.json({ error: "A question is required" }, { status: 400 });
        }

        const result = await env.AI.run(DUODUO_AI_MODEL, {
          messages: [{ role: "system", content: DUODUO_PUBLIC_SYSTEM_PROMPT }, ...publicMessages],
          max_tokens: 420,
          temperature: 0.55,
        });

        const answer = typeof result === "string"
          ? result
          : result && typeof result === "object" && "response" in result && typeof result.response === "string"
            ? result.response
            : "";

        if (!answer.trim()) throw new Error("Workers AI returned an empty response");

        return Response.json({ answer: answer.trim(), model: DUODUO_AI_MODEL });
      } catch (error) {
        console.error("DUODUO AI request failed", error instanceof Error ? error.message : "Unknown error");
        return Response.json({ error: "DUODUO AI is between tides. Please try again shortly." }, { status: 503 });
      }
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
