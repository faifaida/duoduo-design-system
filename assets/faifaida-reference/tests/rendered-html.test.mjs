import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the DUODUO public home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>DUODUO — 多多的未完成实验<\/title>/);
  assert.match(html, /class="ocean-map-page"/);
  assert.match(html, /aria-label="DUODUO archipelago"/);
  assert.match(html, /href="\/world#stories"/);
  assert.match(html, /href="\/world#work"/);
  assert.match(html, /href="\/ai"/);
});

test("keeps current mobile, contact and Skill publishing contracts", async () => {
  const [world, scenes, unified, css] = await Promise.all([
    readFile(new URL("../app/world/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/V5WorldScenes.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/UnifiedScenes.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/v5-tail.css", import.meta.url), "utf8"),
  ]);

  assert.ok(world.indexOf("<StoriesV5 />") < world.indexOf("<WorkV5 />"));
  assert.ok(world.indexOf("<WorkV5 />") < world.indexOf("<SurfV5 />"));
  assert.ok(world.indexOf("<SurfV5 />") < world.indexOf("<AboutV5 />"));
  assert.match(scenes, /className="mobile-story-ledger"/);
  assert.match(scenes, /className="mobile-work-projects"/);
  assert.match(scenes, /https:\/\/www\.instagram\.com\/duoduo_wear\//);
  assert.match(unified, /https:\/\/www\.instagram\.com\/faifaida_\//);
  assert.match(unified, /duoduo-wechat-official\.jpg/);
  assert.match(unified, /raw\.githubusercontent\.com\/faifaida\/duoduo-os\/main\/downloads\/duoduo-design-system\.zip/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(css, /\.contact-channels \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\); \}/);

  await Promise.all([
    access(new URL("../public/contact/duoduo-wechat.jpg", import.meta.url)),
    access(new URL("../public/contact/duoduo-xiaohongshu.jpg", import.meta.url)),
    access(new URL("../public/contact/duoduo-wechat-official.jpg", import.meta.url)),
    access(new URL("../downloads/duoduo-design-system.zip", import.meta.url)),
  ]);
});
