# Information Architecture｜信息架构

## 全站结构

```text
HOME｜主页：The Living Ocean / 活着的海
├── STORIES｜故事：The Traveler’s Trunk / 多多的旅行箱
├── WORK｜作品：The Field Studio / 多多的田野工作站
├── ABOUT｜关于：The Life Voyage / 多多的人生航线
└── SURF｜冲浪：The Wave School / 多多的浪上学校

INDEPENDENT FUNCTION PAGE（不画成岛）
└── AI｜问多多：DUODUO OS / 多多系统
    ├── ASK DUODUO｜问多多
    ├── TAKE SOMETHING｜带走一些东西
    ├── EXPLORE｜探索网站
    ├── NOW｜此刻
    └── CONTACT｜联系
```

## 一级导航

桌面端：

- 左上：官方 Logo
- 海面：四座岛
- 右上：`AI｜问多多` 固定入口、语言切换；AI 入口进入独立 `/ai` 页面，不显示为海面上的第五座岛

移动端：

- 顶部：Logo + OS 按钮 + 语言切换
- 主区：海面背景上的四个纵向或弧形入口卡，不强求同时看见完整四岛
- 每个入口显示英文主名、中文副名和一句极短解释

## 页面命名

| 导航名 | 页面体验名 | 中文体验名 |
|---|---|---|
| HOME｜主页 | The Living Ocean | 活着的海 |
| STORIES｜故事 | The Traveler’s Trunk | 多多的旅行箱 |
| WORK｜作品 | The Field Studio | 多多的田野工作站 |
| ABOUT｜关于 | The Life Voyage | 多多的人生航线 |
| SURF｜冲浪 | The Wave School | 多多的浪上学校 |
| AI｜问多多 | DUODUO OS | 多多系统 |

## 首页岛屿 Hover / Focus 文案

### STORIES｜故事

**Wear, roads, people and found objects.**  
泳衣、旅途、人物与拾得物。

### WORK｜作品

**Work, thinking and experiments tested in the real world.**  
作品、思考与在现实中接受检验的实验。

### ABOUT｜关于

**A life voyage traced through images and turning points.**  
一条由照片与转折留下的人生航线。

### SURF｜冲浪

**Sea, body, practice and a wave school in progress.**  
海、身体、练习，以及正在形成的浪上学校。

## 内容不要重复

- Duoduo Swimwear 的品牌故事和生活照片归入 STORIES / WEAR。
- Duoduo Swimwear 作为商业实验和成果归入 WORK / Selected Work，可链接回 STORIES。
- 旅行故事、人物采访归入 STORIES。
- “世斐”账号作为内容项目归入 WORK，同时精选成品可链接到 STORIES。
- 个人公司、AI 知识库作为项目归入 WORK。
- 人生节点归入 ABOUT，不在首页堆完整介绍。
- 冲浪内容优先归入 SURF；当它成为项目或产品时，可在 WORK 建案例链接。

## 页面深度

原则：海面只展示四个岛屿页面；另设一个清晰、完整、独立的 AI 页面。也就是说，V1 有四个叙事/作品岛页 + 一个 AI 功能页，而不是只有四个页面。

单篇文章、单个作品、单个故事可以拥有详情页：

- `/work/[slug]`
- `/stories/[slug]`
- `/thinking/[slug]`
- `/surf/[slug]`（二期）

但它们不进入顶层导航。


## 顶层路由（确认版）

- `/` — HOME / The Living Ocean
- `/stories` — STORIES / The Traveler’s Trunk
- `/work` — WORK / The Field Studio
- `/about` — ABOUT / The Life Voyage
- `/surf` — SURF / The Wave School
- `/ai` — AI / DUODUO OS

`/ai` 是正式页面，不是只能弹出的浮层。开发时可以额外提供快速 overlay，但不得以 overlay 取代完整 AI 页面。
