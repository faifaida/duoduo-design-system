# Asset Catalog

## 资产等级

### A. 当前正式资产

用于发布与精确复刻：

- `assets/brand/current/`：当前个人品牌 symbol 与 DUODUO WEAR full logo。个人品牌字标按站点源码中的 lockup 规范排版，不使用旧裁切图。
- `assets/wear-product/`：DUODUO WEAR 品牌产品海报与招募视觉。已审核可直发级成品，含品牌 logo 锁定版（bottom-edge linen 色带 + full logo lockup 居中）。**制作规则见 `references/unified-aesthetic.md` 第 7 节「产品 / 海报视觉铁律」——底部沿边 linen 色带铺满、logo 与文案并排缩小、去 AI 水印，不另起炉灶。** 当前资产：
  - `DUODUO_WEAR_v2_recruitment_poster_logo_768x1074.png`：v2 试穿招募海报（泳衣平铺暖米亚麻+深蓝海+teal 绳带，底部 linen #F1E9DA 色带居中放置 duoduo-wear-full-logo）。
  - `DUODUO_WEAR_v2_recruitment_poster_logo_768x1274.png`：同上迭代中间版（更高，logo 相对更大），仅作历史参考，新产出以 768×1074 为基准。
- `assets/site-media/public/`：当前网站公开图片、岛屿 SVG、场景图、海洋图和工具文件。
- `assets/faifaida-reference/`：当前线上完整源码快照。

除非用户明确替换，优先使用这些文件。不要从历史截图重新抠图，也不要自行替换 symbol 或发明新字标。

### B. 方向参考资产

用于理解审美与探索新方案，不代表当前页面结构：

- `assets/direction-references/playground-reference-nine-directions.png`：九个早期空间方向。
- `assets/direction-references/home-concept-reference.png`：群岛式首页概念。
- `assets/direction-references/color-reference-teal-beige.png`：蓝绿色高亮与米色气质参考。
- `assets/direction-references/logo-reference-three-options.jpg`：三套早期 Logo 对比。
- `assets/direction-references/logo-reference-first-lockup.jpg`：当时选定的第一套 Logo。
- `assets/direction-references/logo-*-extracted.png`：自动提取的透明原型件。

这些资产可以用于 moodboard、内部说明与新方案取样。不要原样恢复其中的导航、文案、假域名、联系方式或旧页面数量。

### C. 历史版本资产

- `assets/history-previews/`：V5、V5.4、V5.5、V5.8 的桌面、平板和手机截图。
- `assets/history-source/v5-app` 至 `v5.9-app`：八个实际备份版本的 `app` 源码。

用于理解演变、找回被覆盖的布局或证明某个历史决定。不要因历史版本存在而覆盖当前顺序、留言修复或响应式改进。

### D. 输出模板

- `assets/templates/design-tokens.css`
- `assets/templates/wechat-article.html`
- `assets/templates/social-card.html`
- `assets/templates/brand-poster.html`

模板是起点，不是必须保持不变的成品。替换真实内容和图片，并运行质量门。

`assets/SHA256SUMS` 记录全部资产的 SHA-256。复制、同步或长期归档后，可在 Skill 根目录运行 `shasum -a 256 -c assets/SHA256SUMS` 检查文件是否完整。

## 当前网站图片说明

`assets/site-media/public/` 中的主要分类：

- `brand/`：正式身份资产。
- `ocean/duoduo-living-ocean.png`：首页与场景海面基底。
- `scenes/`：Stories 旅行箱与 Work 田野工作站场景。
- `photos/`：真实旅行、冲浪、Lazyland、About 与 Wear 图片。
- `contact/`：多多OS微信、小红书、个人公众号、WhatsApp 二维码与个人 Instagram 照片。
- `islands/`：五个柔和岛形 SVG，作为旧/辅助图形语言。
- `tools/`：可公开下载的工具内容。

图片文件名已经表达用途。修改文件名或路径前先检查源码引用。

## 素材使用规则

- 保留原图，不覆盖；输出派生图时使用新文件名。
- 不拉伸 Logo、人物和产品。
- 先检查目标画幅再裁切；人物脸、冲浪动作、产品轮廓和场景线索不能被意外切掉。
- 对外发布前确认照片、字体、第三方库和生成图的商业许可。
- 只从密码档案复制已经确认用于公开联系的二维码图片；不复制密码档案本身。不要把 Cloudflare Secret、GitHub Token、本地数据库、聊天记录或私人 Context 放入 Skill 或成品。
