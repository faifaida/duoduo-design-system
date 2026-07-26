# Implementation Guide

## 网站

精确复刻时复制 `assets/faifaida-reference/` 到新项目目录。保持 `app`、`worker`、`db`、`migrations`、`drizzle`、`tests` 和公开资产的相对结构。

典型命令：

```bash
npm install
npm run build
npm test
```

部署配置依赖 Cloudflare 环境。`ADMIN_TOKEN` 必须配置为 Worker Secret，不能写进源码、文档或浏览器存储。留言管理入口是 `/admin/visitor-messages`。

## 新页面

先复用 token、SiteChrome、LocaleProvider 和现有内容对象。将新页面放入一个明确场景，不同时引入多个新视觉系统。新增文案至少保留中文与英文，其他语言按现有结构扩展。

CSS 优先复用变量和现有类的空间逻辑。新增固定画幅组件时声明 `aspect-ratio`、明确网格和最小尺寸。避免负字距；现有源码中的遗留负字距不应扩散到新输出。

## 公众号与社媒

从对应模板复制成新文件。公众号使用内联样式；社媒和海报使用固定 1080x1440 画布。替换示例图为真实资产，检查小尺寸预览，并导出 PNG/JPEG 前在目标像素查看。

## 新图片

优先使用真实资产。确需生成时，保存原始提示词、用途、生成日期和许可状态。将生成图放在项目自己的 `generated/` 目录，不混入 `assets/brand/current/`。

## 验证

- 网站：构建、测试、浏览器控制台、桌面/平板/手机截图、键盘和 reduced motion。
- 公众号：在微信编辑器预览，确认内联样式没有丢失。
- 社媒：检查 25% 缩略图和完整尺寸，确保标题、Logo 和主体都清楚。
- 通用：运行 `node scripts/audit-output.mjs <path>`，再人工执行 `quality-gates.md`。

