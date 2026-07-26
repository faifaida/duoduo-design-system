# Final AI Build Prompt｜最终开发 Prompt

把下方内容连同本文件夹全部资料交给开发 AI：

---

你是一名高级创意开发者、品牌设计师、前端架构师与内容系统设计师。请完整读取本目录的所有 Markdown 和 assets，并开发一个可运行、可发布的 DUODUO 中英文个人网站。

## 最重要的要求

1. 不从通用作品集模板开始。
2. 不复制 Esther Design System 的代码、组件或网页，只借鉴“Brand DNA + Scene + Checklist”的方法。
3. 官方 Logo 必须使用 assets 中第一组 `DUODUO WEAR` 图形与字标，不得重打近似字标。
4. 网站主高亮色是 `#00B4C5`，它首先用于少量被强调的字体、链接、状态词和下划线，其次才用于小面积交互；严禁大面积铺色。主底色是温暖米色 `#F1E9DA`，Logo 身份蓝是 `#2E27A8`。
5. 首页海面只有四座岛：STORIES、WORK、ABOUT、SURF。
6. 另建一个独立 `/ai` 页面，导航名为 `AI｜问多多`，页面内部名为 `DUODUO OS｜多多系统`。它不是第五座岛，但必须是完整、可分享 URL 的核心功能页面；overlay 只能作为快捷入口。
7. 首页采用 C1.5：真实动态海洋为底，手绘岛屿、航线、图腾和文字负责结构。
8. 首页必须在五秒内看懂四个入口，创意不能牺牲可用性。
9. 移动端重新设计布局，不是缩小桌面地图。
10. 使用真实内容与明确 placeholder，不伪造项目结果。

## 必须实现的内容

### HOME

- Logo
- 双语核心文案
- 动态海洋
- 四座可交互岛屿
- Language switcher
- AI｜问多多入口（进入独立 `/ai` 页面）

### STORIES

- The Traveler’s Trunk 场景
- WEAR、ROADS & PEOPLE、FOUND OBJECTS
- 物件与清楚文字导航并存
- 内容详情结构

### WORK

- Selected Work
- Thinking / Notion 内容接口与 mock fallback
- Media & Experiments
- Collaborate
- 项目详情页

### ABOUT

- 7 节点人生航线
- 照片占位
- 双语内容
- “Freedom is not the absence of roots...”结尾

### SURF

- My Surf Story
- Surf Log
- Places
- Notes
- V2 Wave School 教程预告

### DUODUO OS

- Explore
- Ask Duoduo UI + 服务端接口结构
- Take Something
- Now
- Contact

## 开发顺序

第一阶段不要立即写所有视觉代码。先输出：

1. 对需求的理解
2. 站点地图
3. 组件树
4. 数据模型
5. 桌面与移动端交互说明
6. 技术方案
7. 开发里程碑

待确认后：

1. 建立 Design Tokens 和全局框架
2. 完成静态内容结构
3. 完成首页海洋和四岛
4. 完成四页场景
5. 接入 Notion
6. 接入或 mock AI
7. 做响应式、无障碍与性能优化
8. 对照 QA 文件自检

## 输出要求

- 完整项目代码
- README 与环境变量示例
- Mock 数据
- 内容替换说明
- Notion 字段说明
- AI 知识库说明
- 部署步骤
- QA 自检结果

不要只生成一张效果图或一个静态首页。必须交付可运行的网站项目。
