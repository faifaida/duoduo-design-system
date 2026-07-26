# DUODUO OS｜多多的未完成实验

DUODUO's bilingual personal world: an independent living-ocean home with four
world islands and one AI signal atoll, one continuous four-scene world, and a
public AI terminal.

## Routes

- `/` — Ocean Map Explorer / 独立动态海图首页
- `/world#stories` — Stories / 旅行箱
- `/world#work` — Work / 田野工作站
- `/world#about` — About / 人生航线
- `/world#surf` — Surf + DUODUO Swimwear
- `/ai` — DUODUO OS public AI, tools, Now and Contact

## DUODUO Design System Skill

The reusable design Skill behind this website is published in
`skills/duoduo-design-system/`. It includes the current visual system, website
source reference, historical versions, templates and approved assets.

Visitors can open the complete folder from **DUODUO OS -> TAKE SOMETHING**. The
folder is published as the public
[`faifaida/duoduo-design-system`](https://github.com/faifaida/duoduo-design-system)
repository so its structure, references and assets remain directly browsable.

The legacy `/stories`, `/work`, `/about` and `/surf` routes redirect into the matching `/world` scene.

## Local development

```bash
npm install
npm run dev
npm run build
```

Local preview: `http://localhost:3000/`

## Public AI

- Endpoint: `POST /api/duoduo-ai`
- Provider: Cloudflare Workers AI
- Binding: `env.AI`
- Model: `@cf/meta/llama-3.2-3b-instruct`
- Visitors do not log in and never receive an API key.
- Requests are accepted from `faifaida.com`, `www.faifaida.com` and the local preview only, preventing other sites from consuming the allocation.
- The system prompt is intentionally limited to approved public facts in `worker/duoduo-public-context.ts`.

Local Workers AI proxy calls may fail even when the production binding is healthy. Verify the final integration against the deployed Worker.

## Deploy

```bash
npm run build
npx wrangler deploy
```

Production: [faifaida.com](https://faifaida.com)

Current production version: `811caab7-f31a-44c8-baee-e5a19f253f7b`

Global audio is synthesized locally: seashell chime and water drop for controls,
with a distinct quiet shore-wave sound for page passages.

## Key source files

- `app/page.tsx` — independent home
- `app/world/page.tsx` — continuous four-scene world
- `app/ai/page.tsx` — AI page
- `app/components/UnifiedScenes.tsx` — scene interactions and public AI client
- `app/components/SiteChrome.tsx` — logo, contact, language and navigation
- `app/components/LivingOceanCanvas.tsx` — ocean motion
- `app/globals.css` — visual system and responsive rules
- `worker/index.ts` — Worker and AI API endpoint
- `worker/duoduo-public-context.ts` — approved public AI context
- `wrangler.toml` — Cloudflare deployment and AI binding

See `HANDOFF_TO_NEXT_AGENT.md` before making visual or architectural changes.
