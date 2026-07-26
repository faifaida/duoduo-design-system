# DUODUO Personal Website — AI Build Package

这是一套可以直接交给网站开发 AI、前端 Agent、设计 Agent 或开发者执行的完整网站说明包。

它不是一份灵感提案，而是当前已经与多多确认的：

- 网站战略与核心命题
- 四页信息架构
- 双语规则
- 视觉 Brand DNA
- 首页大海与四岛交互
- 每一页的场景设计与内容结构
- Notion Database 接入方式
- DUODUO OS / 公开 AI 对话边界
- 技术实现要求
- V1 与二期边界
- 组件清单、验收标准与最终构建 Prompt

## 使用方法

### 最稳妥的方式

1. 先把 `00_MASTER_SPEC.md` 发给 AI。
2. 再让 AI 读取整个文件夹中的所有 `.md` 文件。
3. 告诉 AI：以本包为唯一产品与设计真相来源，不自行改变页面数量、品牌命题或 Logo。
4. 把 `assets/` 文件夹一并提供给 AI 或开发者。
5. 让 AI 先输出：站点地图、组件树、数据模型、开发计划。
6. 确认后再开始写代码。
7. 交付前严格通过 `17_QA_ACCEPTANCE_CHECKLIST.md`。

### 一句话启动命令

> 请完整读取此文件夹，严格按照 `21_AI_BUILD_PROMPT.md` 开发网站。不要从通用作品集模板开始，不要复制 Esther 的代码，先搭建可运行 V1，再逐页完成交互和内容。

## 当前不可更改的核心决定

- 网站使用中英文。
- 官方 Logo 使用参考图中第一组 `DUODUO WEAR` 图形与原字标。
- 首页是：真实动态海洋 + 手绘岛屿、航线、图腾和文字结构。
- 主高亮色是亮蓝绿色 `#00B4C5`，主要用于某些被强调的字体、关键词、链接和小面积互动标记，不大面积铺底。
- 主底色是温暖米色。
- 首页海面只有四座岛：`STORIES / WORK / ABOUT / SURF`。
- 另有一个独立 AI 页面：`AI｜问多多`（内部名 `DUODUO OS｜多多系统`，路由 `/ai`）。它不是第五座岛，但属于 V1 核心页面；overlay 仅作快捷入口。
- 核心命题是：探索人如何既自由地活，又扎根在真实世界里。

## 目录

- `00_MASTER_SPEC.md`：一份可直接单独投喂 AI 的总规范
- `01_PROJECT_NORTH_STAR.md`：网站战略与受众
- `02_INFORMATION_ARCHITECTURE.md`：页面、路径和导航
- `03_BILINGUAL_COPY_AND_VOICE.md`：双语与文案规则
- `04_BRAND_DNA.md`：色彩、字体、材质、图形、摄影、禁忌
- `05_LOGO_AND_ASSET_RULES.md`：Logo 与素材使用
- `06_MOTION_AND_INTERACTION_DNA.md`：动效和交互
- `07_SCENE_HOME_LIVING_OCEAN.md`：主页
- `08_SCENE_STORIES_TRAVELERS_TRUNK.md`：故事页
- `09_SCENE_WORK_FIELD_STUDIO.md`：作品页
- `10_SCENE_ABOUT_LIFE_VOYAGE.md`：关于页
- `11_SCENE_SURF_WAVE_SCHOOL.md`：冲浪页
- `12_SCENE_DUODUO_OS.md`：菜单、AI 与可带走工具
- `13_COMPONENT_INVENTORY.md`：组件清单
- `14_CONTENT_MODEL_AND_NOTION.md`：内容数据模型
- `15_PUBLIC_AI_KNOWLEDGE_AND_SAFETY.md`：公开 AI 的资料与边界
- `16_TECHNICAL_BUILD_SPEC.md`：技术实现
- `17_QA_ACCEPTANCE_CHECKLIST.md`：验收清单
- `18_V1_V2_SCOPE.md`：一期与二期
- `19_INITIAL_CONTENT_SEED.md`：第一批可用内容
- `20_OPEN_INPUTS_BEFORE_LAUNCH.md`：上线前需要补齐的信息
- `21_AI_BUILD_PROMPT.md`：最终开发 Prompt
- `22_INSPIRATION_AND_LICENSE_BOUNDARY.md`：灵感与原创边界
- `assets/`：Logo、配色和 Playground 参考

## 资产说明

`assets/logo-lockup-transparent-extracted.png`、`logo-symbol-transparent-extracted.png` 和 `logo-wordmark-transparent-extracted.png` 是从 JPG 参考图自动提取的临时透明版本。可用于原型，但正式上线前应使用设计师提供的原始矢量或高清透明文件替换。
