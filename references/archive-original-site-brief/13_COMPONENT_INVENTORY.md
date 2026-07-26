# Component Inventory｜组件清单

## Global

### `LogoLockup`

官方 Logo，支持 full / symbol / wordmark。

### `BilingualLabel`

英文主名 + 中文副名；支持 compact / hero / navigation。

### `LanguageSwitcher`

中文 / EN；记住用户选择。

### `DuoduoOSButton`

进入 `/ai` 独立页面；桌面端可先打开快速 OS overlay。

### `PageTransition`

海浪或潮汐式转场；尊重 reduced motion。

### `NowBadge`

小型当前位置与更新状态入口。

## Home

### `LivingOceanCanvas`

动态海面层，支持视频、Canvas、静态 fallback。

### `IslandNode`

属性：

- id
- title_en / title_zh
- description_en / description_zh
- scene_art
- position
- route
- preview_asset

### `RouteTrace`

岛屿之间手绘航线和 active 状态。

### `OceanIntro`

主页核心两段文案。

## Stories

### `TrunkScene`

旅行箱主场景。

### `TrunkObject`

泳衣、护照、相机、日记、贝壳等可交互物件。

### `StoryDrawer`

WEAR / ROADS & PEOPLE / FOUND OBJECTS。

### `StoryFragment`

支持图片、音频、票据、短句、视频、物件说明。

### `StoryReader`

统一详情阅读组件。

## Work

### `ProjectDossier`

项目摘要卡与状态。

### `CaseStudySection`

Context / Role / Process / Outcome 等。

### `ThinkingFilter`

Notion 内容筛选。

### `ThinkingEntry`

文章、复盘和观点卡。

### `ExperimentStatus`

Active / Testing / Paused / Completed / Failed。

### `CollaboratePanel`

合作方向和联系 CTA。

## About

### `VoyageRoute`

人生航线。

### `VoyageNode`

照片、地点、年份、三个问题。

### `OrganicPhotoFrame`

有机相框；可圆形、椭圆或不规则。

### `CarryableRootsQuote`

About 结尾核心句。

## Surf

### `SurfHero`

海浪开场。

### `SurfLogEntry`

冲浪日志。

### `SurfPlaceMarker`

地点和故事。

### `WaveNotebookLink`

V2 教程入口占位。

## DUODUO OS

### `AIPageShell` / `OSOverlay`

全局功能层。

### `OSNavigation`

Explore。

### `PublicAIChat`

公开 AI 对话。

### `TakeawayToolCard`

工具和 Prompt 下载。

### `NowPanel`

当前状态。

### `ContactPanel`

联系方式与表单。

## 组件原则

- 同类内容使用同一组件，不每个 section 发明新样式。
- 组件可以有材质变体，但结构保持一致。
- 不使用浏览器默认 table、blockquote、list 样式。
- 交互元素必须有 hover、focus、active、disabled 状态。
- 手机端是重新排列，不是缩小。


### `AIPageShell`

独立 `/ai` 页面的主容器，必须支持 Ask Duoduo、Take Something、Explore、Now、Contact 五个区域。`OSOverlay` 仅为快速入口组件，不得作为 AI 功能的唯一载体。
