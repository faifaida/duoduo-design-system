---
name: duoduo-design-system
description: 多多（DUODUO / faifaida.com）的完整个人与公司视觉设计系统。用于复刻或扩展 faifaida.com，制作品牌网站、活动页、作品页、公众号排版、社媒图文、海报、品牌视觉、界面组件和图片提示词；也用于审核员工或 AI 的设计是否符合多多已确认的审美、文案、交互、素材和商业安全边界。
---

# DUODUO Design System

把多多的审美当成一套可执行的世界观，不要当成一张配色卡。

核心判断：**野而温柔，原始而精致，自由而有骨头，手作而有世界。**

**审美锚点（先读这份）**：`references/unified-aesthetic.md` 是所有产出的统一审美真值表——颜色、字体、材质、母题、布局、海报铁律、红线、agent 执行清单全部收敛在一处。动手前先读完它，再查下面的专项文件。

## 先判断任务

将任务归入一个主类型：

1. **精确复刻 faifaida.com**：从 `assets/faifaida-reference/` 开始，完整保留页面结构、素材、文案与交互。
2. **扩展或修改网站**：先读现有源码，再在同一空间语言内新增，不另造一套设计系统。
3. **新网站或品牌页面**：使用本 Skill 的视觉、布局与内容规则，但根据真实用途重组信息。
4. **公众号、社媒图文或海报**：使用固定画幅、字号安全区和图像层级，不把网页截图直接当成成品。
5. **设计审核**：先找 P0 违规，再判断是否“像多多”，最后提出具体修改。

## 真相优先级

发生冲突时按以下顺序执行：

1. 多多在当前任务中的最新明确决定。
2. `assets/faifaida-reference/` 中的当前线上源码和当前正式素材。
3. 本 Skill 的 canonical references。
4. `references/archive-original-site-brief/` 的原始完整产品说明。
5. 历史截图、旧版源码与未采用方向，只用于理解演变，不自动恢复。

不要把“文件存在”误判为“当前仍采用”。查看 `references/asset-catalog.md` 的资产等级。

## 必读路由

每个设计任务**先读** `references/unified-aesthetic.md`（统一审美锚点），然后按任务追加：

- `references/identity-and-voice.md`：品牌命题、受众、文案与双语规则。
- `references/visual-system.md`：颜色、字体、材质、摄影、母题与禁忌（锚点的展开版）。
- `references/asset-catalog.md`：正式资产、参考资产、历史资产的位置与用法。
- 海报 / 产品图：锚点第 7 节「产品 / 海报视觉铁律」是硬规则，不另起炉灶。

按任务追加读取：

- 精确复刻或网站改动：`references/website-reproduction.md`、`references/scene-language.md`、`references/interaction-responsive.md`、`references/implementation.md`。
- 新页面或组件：`references/components-and-layouts.md`、`references/quality-gates.md`。
- 公众号、社媒或海报：`references/social-wechat.md`、`references/quality-gates.md`。
- 追溯设计决定：`references/version-history.md` 和 `references/archive-original-site-brief/`。
- 对外发布或引入第三方素材：`references/licensing-and-safety.md`。

## 执行工作流

### 1. 收集最小必要信息

确认用途、受众、平台或画幅、核心信息、现有文案和必须使用的素材。能从仓库与任务上下文确定的内容不要反复询问。

### 2. 选择一个主空间语言

网站场景从以下世界中选择一个主语言：活着的海、旅行箱、田野工作站、浪上学校、人生航线、DUODUO OS。公众号和社媒使用“编辑档案 + 真实材料 + 一个明确母题”。

不要把所有母题和所有组件堆进同一页面。

### 3. 从现成资产开始

- 精确网站：复制 `assets/faifaida-reference/`，不要凭截图重写。
- 公众号：从 `assets/templates/wechat-article.html` 开始。
- 图文或海报：从 `assets/templates/social-card.html` 或 `brand-poster.html` 开始。
- 品牌标志：使用 `assets/brand/current/duoduo-symbol.png`，个人品牌字标按当前站点 lockup 规范排版；Wear 只用正式 full logo。

### 4. 建立信息层级

先写内容结构，再选择视觉形式。每个画面只保留一个主句、一个视觉焦点和一个明确动作。使用真实地点、人物、动作、项目角色和状态，不用空泛自由宣言。

### 5. 应用视觉系统

使用批准的 token、全衬线编辑感、真实照片、纸/麻/木/海等可触摸材质和一个有意义母题。亮蓝绿色是高亮笔，不是墙漆。

### 6. 完成交互与响应式

动效来自漂流、潮汐、波浪、痕迹和发现。移动端重新编排，不缩小桌面构图。所有操作必须支持触屏与键盘，并尊重 `prefers-reduced-motion`。

### 7. 运行质量门

逐条执行 `references/quality-gates.md`。网站类输出还要构建并在桌面、平板、手机验证；图片类输出要在目标尺寸查看文字、边距、对比度和裁切。

可运行：

```bash
node scripts/audit-output.mjs <output-path>
```

### 8. 交付

交付可直接使用的文件，不只交效果描述。说明采用的正式素材、保留的历史参考、未解决的真实内容缺口和验证结果。

## 不可破坏的决定

- 使用真实 `DUODUO` symbol 与当前站点 lockup 规范，不使用旧裁切残片或另造字标。
- 当前网站章节顺序是 `Stories -> Work -> Surf & Wear -> About`。
- 首页保持海洋世界与清楚入口，不做通用 Landing Page。
- `#00B6C5 / #1FCEDD` 只作重点和互动高亮，不大面积铺底。
- 主底偏暖米色，正文使用暖墨或深海色，不用纯黑纯白主导。
- 不使用蓝紫渐变、玻璃拟态、霓虹科技风、通用 SaaS 卡片墙或 AI stock photo。
- 不伪造项目结果，不把正在学习包装成专家服务。
- 不公开私人日记、心理咨询、关系、家庭、财务、密码或完整个人 Context。
- 不复制 Esther Design System 的受限代码；只沿用“Skill + 场景 + 组件 + Checklist”的方法。
