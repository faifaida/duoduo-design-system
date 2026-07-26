# Scene: DUODUO OS｜多多系统

## 定位

DUODUO OS 不是第五座岛，但它是网站中独立存在的第五个核心功能页面，正式路由为 `/ai`。它同时可以通过全局菜单或轻量 overlay 快速打开，但 overlay 只是快捷入口，不能代替完整页面。

它借鉴终端与个人 OS 的交互感，但视觉与代码必须原创。不能复制 Esther 页面或设计系统组件。

## 页面命名与入口

导航显示：`AI｜问多多`

页面内部标题：`DUODUO OS｜多多系统`

正式路由：`/ai`

入口：

- 全站右上角固定 `AI｜问多多`
- 菜单中的独立页面项
- Logo symbol 附近的 AI/无线电按钮（可选）
- 键盘快捷键（可选）

首页海面仍然只有四座岛，AI 按钮视觉上必须与岛屿导航区分。

## 视觉

可以进入“夜海模式”：

- 深海墨绿 `#1F2E29`
- 米白文字
- 蓝绿色 active 状态
- Logo 原蓝作为身份印章
- 少量等宽字体

不要使用黑底霓虹绿 Hacker 模板。

## 独立 AI 页的五个功能区

### EXPLORE｜探索

```text
Home
Stories
Work
About
Surf
```

显示当前页和一句说明。

### ASK DUODUO｜问多多

公开 AI 对话，可回答：

- 多多是谁
- 她做过什么项目
- 如何理解自由与扎根
- 网站从哪里开始看
- 有什么合作方式
- 哪些公开工具可使用

AI 只读取公开知识库，不读取私人 Context。

### TAKE SOMETHING｜带走一些东西

V1 初始工具：

1. Life Reset Questions｜人生重构问题
2. Personal Context Starter｜个人 Context 起步模板
3. Experiment Review｜个人实验复盘模板

以后可增加：

- 青旅体验观察表
- 旅行人物采访提纲
- AI 学习闭环模板

工具必须真实可用，不做 Prompt 垃圾场。

### NOW｜此刻

字段：

- Location
- Currently building
- Currently learning
- Current question
- Next stop
- Open for collaboration
- Last updated

### CONTACT｜联系

- Email
- WeChat / 其他方式（由多多最终确认）
- Social accounts
- Collaboration form

## AI 对话 UX

建议开场问题：

- “多多现在在建造什么？”
- “我应该从哪一页认识她？”
- “她有哪些文旅和内容经验？”
- “自由与扎根是什么意思？”
- “我能从这里带走什么工具？”

回答应：

- 简洁
- 引用网站页面
- 明确区分完成项目与进行中实验
- 不推断私人关系与心理状态
- 不回答私人联系方式之外的敏感信息

## 无 API 时

V1 可先实现：

- 可搜索 FAQ
- 基于预写答案的模拟对话
- 完整服务端接口占位

不能为了赶工把 API Key 写在前端。
