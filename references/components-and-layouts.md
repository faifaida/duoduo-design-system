# Components and Layouts

## 目录

- 组件原则
- 全局组件
- 内容组件
- 页面布局
- 状态与可访问性

## 组件原则

让内容决定形式。一个页面可以有 3–5 种布局节奏，但同类内容必须使用同一种组件语言。不要做组件展览会，不要把每段文字装进卡片。

所有组件使用 `visual-system.md` 的 token。禁止浏览器默认 blockquote、table、list 和 button 外观。

## 全局组件

- **Logo lockup**：个人品牌使用真实 symbol 加当前站点固定文字 lockup；DUODUO WEAR 使用正式 full logo。旧裁切 wordmark 不是发布资产。
- **Site chrome**：Logo、Contact、DUODUO OS、音效和语言入口组成安静工具条。
- **Bilingual label**：英文主名 + 中文副名；中文距离紧，不另起一个大标题。
- **Voyage rail**：使用章节点、编号和船形 Home 门户表达旅程，不用普通 Tab 条。
- **Scene title plaque**：小编号、英文场景名和中文说明，像档案标签。

## 内容组件

- **Paper dossier**：项目、人生节点或长内容的纸面容器；使用边缘、印章或材质，不用悬浮白卡。
- **Object drawer**：Stories 的物件和抽屉，可揭示背面、标签与关联内容。
- **Organic photo frame**：少量圆形、椭圆、船舷或不规则相框；同屏形状要有关系。
- **Status label**：Active / Testing / Paused / Completed / Failed，使用小号等宽或英文衬线。
- **Route node**：年份、地点、图形节点和航线；必须有文本替代。
- **Wave notebook**：Surf 的训练、地点和失误记录，像真实练习页。
- **Tool window**：OS 工具预览可以像桌面或终端，但按钮和输入保持可用。
- **Quote field**：使用大面积留白、行内高亮、照片上的短句或独立排版，不使用左竖线引用块。

## 页面布局

可组合：

1. 全屏环境 + 浮动导航入口。
2. 偏置标题 + 大场景图。
3. Sticky 侧栏 + 长内容档案。
4. 航线轴 + 交错节点。
5. 纸面 dossier + 两张不对称照片。
6. 真实桌面 / 旅行箱的物件热点。
7. 深夜海 + 浅纸面详情。
8. 横向章节世界，移动端重排为纵向。
9. 大照片 + 小标签轨道。
10. 编辑文章：大标题、摘要、实拍、正文与一个侧注。

不要默认使用对称 50/50、三等分卡片网格或所有 section 居中。固定格式元素使用明确尺寸、`aspect-ratio`、grid tracks 和 `minmax()`，避免内容变化导致跳动。

## 状态与可访问性

为 hover、focus-visible、active、disabled、loading、empty 和 error 设计状态。触屏不能依赖 hover。键盘焦点与视觉 hover 等价。交互热点使用真实 button/link 和可读标签，不只依赖装饰 SVG。
