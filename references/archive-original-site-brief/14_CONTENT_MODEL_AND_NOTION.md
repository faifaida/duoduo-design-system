# Content Model & Notion Integration｜内容模型与 Notion 接入

## 原则

- Notion 是内容管理来源之一，不是页面视觉。
- 网站通过 API 读取公开数据，再用 DUODUO 组件渲染。
- 只有明确 `Public = true` 的条目可以公开。
- 数据库断开时，网站应使用本地缓存或 mock 数据，不出现空白崩溃。

## 建议 Database：Public Work & Thinking

字段：

| 字段 | 类型 | 说明 |
|---|---|---|
| `Name` | Title | 内部名称 |
| `Slug` | Text | URL slug |
| `Title ZH` | Text | 中文标题 |
| `Title EN` | Text | 英文标题 |
| `Summary ZH` | Text | 中文摘要 |
| `Summary EN` | Text | 英文摘要 |
| `Content Type` | Select | Work / Thinking / Media / Experiment / Story / Surf |
| `Topic` | Multi-select | Life / AI / Travel / Hospitality / Creativity / Surf / Wear |
| `Status` | Select | Active / Testing / Paused / Completed / Failed |
| `Public` | Checkbox | 是否公开 |
| `Featured` | Checkbox | 是否精选 |
| `Published Date` | Date | 发布日期 |
| `Updated Date` | Date | 更新时间 |
| `Location` | Text | 地点 |
| `Cover` | Files | 封面 |
| `Gallery` | Files | 图集 |
| `External URL` | URL | 播客、视频或社媒链接 |
| `Related Project` | Relation | 关联项目 |
| `SEO ZH` | Text | 中文 SEO 描述 |
| `SEO EN` | Text | 英文 SEO 描述 |

## Project 数据模型

```ts
interface Project {
  slug: string
  titleZh: string
  titleEn: string
  summaryZh: string
  summaryEn: string
  cover: Media
  status: 'active' | 'testing' | 'paused' | 'completed' | 'failed'
  period?: string
  location?: string
  topics: string[]
  contextZh: RichText
  contextEn: RichText
  questionZh?: RichText
  questionEn?: RichText
  roleZh: RichText
  roleEn: RichText
  processZh: RichText
  processEn: RichText
  outcomeZh: RichText
  outcomeEn: RichText
  changedZh?: RichText
  changedEn?: RichText
  assetsLeftZh?: RichText
  assetsLeftEn?: RichText
  gallery: Media[]
  relatedStories: string[]
  relatedThinking: string[]
  featured: boolean
  public: boolean
}
```

## Story 数据模型

```ts
interface Story {
  slug: string
  drawer: 'wear' | 'roads-people' | 'found-objects'
  titleZh: string
  titleEn: string
  summaryZh: string
  summaryEn: string
  date?: string
  location?: string
  cover: Media
  media: Media[]
  bodyZh?: RichText
  bodyEn?: RichText
  objectType?: string
  relatedProject?: string
  public: boolean
}
```

## Voyage 数据模型

```ts
interface VoyageNode {
  id: string
  order: number
  labelZh: string
  labelEn: string
  period: string
  locationZh: string
  locationEn: string
  happenedZh: string
  happenedEn: string
  changedZh: string
  changedEn: string
  remainsZh: string
  remainsEn: string
  photos: Media[]
  artifact?: Media
}
```

## Now 数据模型

```ts
interface NowData {
  locationZh: string
  locationEn: string
  buildingZh: string[]
  buildingEn: string[]
  learningZh: string[]
  learningEn: string[]
  currentQuestionZh: string
  currentQuestionEn: string
  nextStopZh?: string
  nextStopEn?: string
  openForZh: string[]
  openForEn: string[]
  updatedAt: string
}
```

## 内容发布流程

1. 多多在 Notion 创建或更新条目。
2. 完成中文内容。
3. 英文内容人工或 AI 初译后，由多多审核语气。
4. 设置 `Public = true`。
5. 网站抓取并缓存。
6. 更新后触发 revalidation。
7. 如为重要文章，检查图片、SEO 和相关项目链接。

## 不进入公开 Database 的内容

- 私人日记
- 心理咨询记录
- 关系与家庭细节
- 未确认的商业数据
- 合同、财务与内部项目文件
- 完整个人 Context
