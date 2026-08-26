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
  assert.match(unified, /https:\/\/www\.instagram\.com\/duoduo_wear\//);
  assert.match(unified, /duoduo-wechat-official\.jpg/);
  assert.match(unified, /github\.com\/faifaida\/duoduo-design-system/);
  assert.doesNotMatch(unified, /duoduo-design-system\.zip/);
  assert.match(unified, /duoduo-instagram\.jpeg/);
  assert.match(unified, /duoduo-whatsapp\.jpeg/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(css, /\.contact-channels \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\); \}/);

  await Promise.all([
    access(new URL("../public/contact/duoduo-wechat.jpg", import.meta.url)),
    access(new URL("../public/contact/duoduo-xiaohongshu.jpg", import.meta.url)),
    access(new URL("../public/contact/duoduo-wechat-official.jpg", import.meta.url)),
    access(new URL("../public/contact/duoduo-instagram.jpeg", import.meta.url)),
    access(new URL("../public/contact/duoduo-whatsapp.jpeg", import.meta.url)),
  ]);
});

test("publishes the growing divergent universe through TAKE SOMETHING", async () => {
  const [response, unified, universe, worker] = await Promise.all([
    render("/ai/universe"),
    readFile(new URL("../app/components/UnifiedScenes.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ai/DivergentUniverse.tsx", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  ]);

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /DIVERGENT UNIVERSE/);
  assert.match(html, /此刻，你想从什么开始？/);
  assert.match(unified, /path: "\/ai\/universe"/);
  assert.match(unified, /href=\{tool\.path\}/);
  assert.match(universe, /retainCandidate/);
  assert.match(universe, /centreAndGenerate/);
  assert.match(universe, /deleteAlongSegment/);
  assert.match(universe, /segmentDistance/);
  assert.match(universe, /openIndependentDraft/);
  assert.match(universe, /startLongPress/);
  assert.match(universe, /labels\.slice\(0, 5\)/);
  assert.match(universe, /duoduo-divergent-workspace-v2/);
  assert.match(universe, /撤回上一步/);
  assert.match(universe, /divergent-organize/);
  assert.doesNotMatch(universe, />都不要</);
  assert.doesNotMatch(universe, />换一批</);
  assert.doesNotMatch(universe, /候选操作/);
  assert.match(worker, /url\.pathname === "\/api\/divergent-universe"/);
  assert.match(worker, /completeDivergentNodes/);
  assert.match(worker, /assisted-fallback/);
  assert.match(worker, /不得连续使用中心词作前缀/);
  assert.match(worker, /nearDuplicate/);
  assert.match(worker, /verifyGithubDeployIdentity/);
  assert.match(worker, /faifaida\/duoduo-design-system/);
  assert.match(worker, /Cache-Control.*no-store/);
});

test("keeps the divergent universe available when the upstream AI tide is quiet", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("fallback-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/api/divergent-universe", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "http://localhost" },
      body: JSON.stringify({ center: "海边学校", avoid: [] }),
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
      AI: { run: async () => { throw new Error("AI tide unavailable"); } },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.source, "assisted-fallback");
  assert.equal(data.nodes.length, 5);
  assert.equal(new Set(data.nodes).size, 5);
});

test("keeps fallback associations visibly connected to familiar objects", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("object-fallback-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(new Request("http://localhost/api/divergent-universe", {
    method: "POST", headers: { "content-type": "application/json", origin: "http://localhost" },
    body: JSON.stringify({ center: "袜子", avoid: [] }),
  }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) }, AI: { run: async () => { throw new Error("offline"); } } }, { waitUntil() {}, passThroughOnException() {} });
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(data.nodes.slice(0, 2), ["鞋子", "穿搭"]);
});

test("filters repeated AI associations before they reach the universe", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("diversity-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const labels = [
    "太极养生", "太极哲学", "阴阳", "八卦图", "松沉", "金刚经",
    "武当山", "云手", "潮汐", "黑白鱼", "柔克刚", "呼吸节律",
  ];
  const response = await worker.fetch(
    new Request("http://localhost/api/divergent-universe", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "http://localhost" },
      body: JSON.stringify({ center: "太极", avoid: [] }),
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
      AI: {
        run: async () => ({
          response: JSON.stringify({
            nodes: labels.map((label) => ({ label, bridge: `${label}与中心存在一条具体可解释的连接` })),
          }),
        }),
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.nodes.length, 5);
  assert.equal(new Set(data.nodes).size, 5);
  assert.ok(data.nodes.filter((label) => label.startsWith("太极")).length <= 1);
});

test("recovers labels from truncated AI JSON without leaking JSON keys", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("truncated-json-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/api/divergent-universe", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "http://localhost" },
      body: JSON.stringify({ center: "二十四节气", avoid: [] }),
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
      AI: { run: async () => ({ response: '{"nodes":[{"label":"候鸟迁徙","bridge":"季节改变迁徙方向"},{"label":"身体节律","bridge":"身体也会感知季节"},{"label":"月相","bridge":"古老历法观察天体"' }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.nodes.length, 5);
  assert.ok(data.nodes.includes("候鸟迁徙"));
  assert.ok(data.nodes.every((label) => !/["{}\[\]]|nodes|bridge/.test(label)));
});

test("filters structural AI leakage and creates complete organization snapshots", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("organization-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const nodes = Array.from({ length: 12 }, (_, index) => ({ id: `n${index + 1}`, label: `想法${index + 1}` }));
  const response = await worker.fetch(
    new Request("http://localhost/api/divergent-organize", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "http://localhost" },
      body: JSON.stringify({ title: "测试宇宙", nodes }),
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
      AI: { run: async () => { throw new Error("use deterministic fallback"); } },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.ok(data.clusters.length >= 3 && data.clusters.length <= 5);
  const organizedIds = data.clusters.flatMap((cluster) => cluster.nodeIds);
  assert.deepEqual(new Set(organizedIds), new Set(nodes.map((node) => node.id)));
  assert.equal(organizedIds.length, nodes.length);
  assert.match(JSON.stringify(data), /整理快照/);
});
