# Technical Build Specification｜技术实现规范

## 推荐技术栈

不锁死版本号，使用实施环境中当前稳定版本。

- Framework：Next.js / React
- Language：TypeScript
- Styling：CSS Modules、SCSS 或 Token 化 Tailwind；不得依赖通用主题模板
- Motion：CSS transform + 轻量 motion library
- Ocean：video / Canvas / WebGL 渐进增强
- CMS：Notion API + 本地 fallback
- AI：服务端 API + 公开知识库检索
- Deployment：支持环境变量与边缘缓存的平台

## 目录建议

```text
app/
  [locale]/
    page.tsx
    stories/
    work/
    about/
    surf/
  api/
    notion/
    chat/
components/
  global/
  ocean/
  stories/
  work/
  about/
  surf/
  os/
content/
  mock/
  public-ai/
lib/
  notion/
  ai/
  i18n/
  media/
styles/
  tokens.css
  globals.css
public/
  brand/
  photos/
  video/
```

## Design Tokens

至少建立：

```css
:root {
  --ocean-teal: #00B4C5;
  --linen: #F1E9DA;
  --logo-blue: #2E27A8;
  --warm-ink: #5B2E2B;
  --deep-sea-ink: #1F2E29;
  --paper: #FAF6EE;
  --wood: #8A6A4A;
  --terracotta: #B5713F;
  --turquoise-soft: #4FB0A1;
  --ocean-deep: #157A6E;
  --vintage-gold: #C99A3F;
  --paisley-red: #9E4A3A;
}
```

## 首页海洋实现优先级

### 方案 A：视频 + HTML/SVG 岛屿

最推荐 V1。真实海面视频负责真实感；SVG/HTML 负责清晰交互、SEO 和无障碍。

### 方案 B：Canvas/WebGL 水面 + DOM 岛屿

适合进一步定制，开发成本更高。

### 方案 C：纯 3D 世界

不建议 V1，容易拖慢、难维护，并削弱内容。

## 性能预算

- 首屏主资源尽量低于 2.5–3MB；海洋视频按设备提供多个版本
- LCP 目标 < 2.5s（合理网络下）
- 图片使用现代格式与响应式尺寸
- 视频 muted、playsInline、loop；预载策略克制
- 动效不触发频繁 layout
- 非首屏媒体 lazy load
- AI 组件延迟加载

## 国际化

推荐：

- 路由 `/zh`、`/en`
- 首页核心双语同屏
- 详情正文依 locale 显示
- 使用 cookie 或 localStorage 记忆语言
- URL 可分享并保留语言

## Notion

- 服务器端获取
- 缓存与 revalidation
- 明确字段映射
- `Public = true` 才返回
- 失败时回退到本地内容
- 不向客户端暴露 Database secret

## AI Chat

- `/api/chat` 服务器端
- 检索只在 approved public corpus
- 流式输出可选
- 频率限制
- 基础防提示注入
- 不允许检索服务器其他文件
- 聊天框必须说明“基于公开资料”

## SEO

- 每页中英文 title 与 description
- Open Graph 图
- 项目和文章详情页结构化数据
- sitemap / robots
- canonical locale 链接
- 图片 alt 文本

## 表单

合作表单字段：

- Name
- Email / Contact
- Organization
- Collaboration type
- What are you building?
- Why Duoduo?
- Timeline
- Budget range（可选）

必须包含成功、失败与 loading 状态；防垃圾提交。

## Analytics

保持轻量，关注：

- 四岛点击
- 项目详情浏览
- 合作表单启动与完成
- Ask Duoduo 使用
- Take Something 下载
- 语言选择

不要使用侵入式追踪。


## AI 页面路由要求

- 必须提供独立 `/ai` 路由。
- `/ai` 支持直接访问、刷新、浏览器前进后退和分享链接。
- 全局 overlay 可选，但只作为 `/ai` 的快捷预览。
- 首页海面不添加第五座 AI 岛。
