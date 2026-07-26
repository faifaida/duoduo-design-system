# About 人生航线照片 · 落位映射

`app/about/page.tsx` 第 52–53 行有 2 个 polaroid 占位：
- `polaroid-one` → 当前显示 `PHOTO · {地点}`
- `polaroid-two` → 当前显示 `MEMORY TO ADD`

## 命名约定（放入本目录 public/photos/）

| 文件命名 | 对应人生阶段（voyage 节点） | 说明 |
|---|---|---|
| `01-zhengzhou.jpg` | 郑州 · 最早的世界 | 只有本人有 |
| `02-maryland.jpg` | 美国·马里兰 · 第一次离开 | 只有本人有 |
| `03-singapore.jpg` | 新加坡 · 体面的轨道 | 只有本人有 |
| `04-overland.jpg` | 30+ 国陆路 · 漫长的路 | 旅行照可借用 02_CONTEXT/审美效果参考 |
| `05-wenlv.jpg` | 文旅回国 · 回到真实项目 | 懒懒岛/项目照 |
| `06-srilanka.jpg` | 斯里兰卡冲浪 · 海与身体 | 冲浪照可借用审美参考 |
| `07-now.jpg` | 此刻 · 个人公司 | 近期照 |

> 没有的阶段可用占位图，但有真实照片更稳。郑州/马里兰/新加坡这种只有本人有。

## 填法（内容位，不动设计）

把 `app/about/page.tsx` 第 52–53 行的两个 `<span>` 占位，改为引用对应照片，
例如给 `polaroid-one` 加 `style={{ backgroundImage: 'url(/photos/01-zhengzhou.jpg)' }}` 或用 `<img>`。
版式、动效、配色保持 GPT 原样。
