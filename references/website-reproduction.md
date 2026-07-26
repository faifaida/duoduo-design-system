# Website Reproduction

## 精确基线

不要根据截图从零复刻。直接以 `assets/faifaida-reference/` 为完整源码基线，其中包含：

- Next.js / React 页面与组件。
- 当前 `globals.css` 与 `v5-tail.css`。
- 多语言内容模型。
- 海洋 Canvas、场景组件和全局导航。
- 留言与审核界面、Cloudflare Worker、数据库迁移。
- 所有当前公开图片与 SVG。
- 构建配置与测试。

复制后执行 `npm install`、构建和跨尺寸截图验证。不要把任何密码或本地 Secret 写进源码。

## 当前站点结构

```text
/
  Living Ocean 首页
/world#stories
  Stories / Traveler's Trunk
/world#work
  Work / Field Studio
/world#surf
  Surf & Wear / Wave School
/world#about
  About / Life Voyage
/ai
  DUODUO OS
/admin/visitor-messages
  留言审核后台
```

当前世界章节顺序必须保持：`Stories -> Work -> Surf & Wear -> About`。这是用户在上线后明确调整的最新决定，优先于早期 brief 中 `About -> Surf` 的顺序。

## 技术基线

- Node.js `>=22.13.0`
- Next.js 16 + React 19 + TypeScript
- vinext / Vite / Cloudflare Workers
- `motion` 用于少量交互
- `simplex-noise` 驱动海面纹理
- Drizzle + Cloudflare 数据存储留言

## 关键模块

- `app/components/UnifiedScenes.tsx`：首页与统一场景。
- `app/components/V5WorldScenes.tsx`：Stories、Work、Surf、About 主体验。
- `app/components/LivingOceanCanvas.tsx`：海面动态。
- `app/components/SiteChrome.tsx`：Logo、联系、OS、语言与章节导航。
- `app/i18n/content.ts`：多语言正式文案。
- `app/globals.css`：基础视觉和主要场景。
- `app/v5-tail.css`：V5 后续页面、工具和审核界面。
- `worker/index.ts`：API、公开 AI 与留言逻辑。

## 修改规则

先定位现有组件和样式，再做最小范围修改。不要用新框架重写同一功能，不要把场景改成卡片 Dashboard，不要替换真实素材。新增内容应沿用现有内容对象、语言结构、CSS token、键盘状态和 reduced-motion 行为。

后台 Token 只能来自 Cloudflare Secret。Skill 不保存任何登录信息。

