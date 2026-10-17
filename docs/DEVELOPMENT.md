# 二次开发教程

[English](DEVELOPMENT.en.md) · [项目首页](../README.md) · [Agent 指南](AGENT_GUIDE.md)

本教程面向第一次接手项目的开发者。默认在项目根目录执行命令。用 Node.js 22 和 `npm ci` 安装依赖，`npm run dev -- --host 127.0.0.1` 启动开发预览。

## 1. 理解数据流

```text
src/data/shouzhou_ceramics.json
  → App.jsx 解析图片路径、维护选中条目和视图
  → ArtifactRail 文物导航
  → CeramicDisplay 主图与全屏档案
  → DataPanel 资料弹窗
```

`public/assets/ceramics/archive/index.json` 和逐件 `szk-*.json` 是来源档案，不是页面渲染的数据入口，但校验脚本要求它们与运行数据同步。

`public/` 中的所有文件都会复制到静态构建。即使档案 JSON 不被组件读取，它们也会成为可下载资源。复用代码时先确定自己的内容和图片权限，见 [素材授权说明](../ASSET_LICENSE.md)。

## 2. 修改展台名称与外观

当前采用 Tailwind CSS 4.3 与 `@tailwindcss/vite`，由 `vite.config.js` 注册。`src/index.css` 通过 `@config` 加载现有 JavaScript 主题配置，通过显式 `@source` 限定源码扫描范围。新增 class 应写为完整字面量，避免运行时拼接导致生成器无法检测。

视图按钮使用 sRGB 渐变，资料弹窗采用 4px 背景模糊，正文行高由响应式样式控制。修改主题后检查按钮、弹层和长文字。

| 需求 | 文件 | 修改位置 |
| --- | --- | --- |
| 浏览器标题 | `index.html` | `<title>` |
| 页面中英文名称 | `src/App.jsx` | 顶部标题与英文副标题 |
| 青瓷色和青铜色 | `tailwind.config.js` | `theme.extend.colors` |
| 全局字体、动效、触控规则 | `src/index.css` | 全局样式 |
| 导航每次滚动距离 | `src/constants/index.js` | `RAIL_SCROLL_STEP` |
| 主图与全屏显示 | `src/components/CeramicDisplay.jsx` | 主图和 Portal 弹层 |
| 资料字段呈现 | `src/components/DataPanel.jsx` | `ValuePair` 与分区 |

字体族名称只引用本机字体；增加字体文件或第三方图标时同步增加许可声明。

## 3. 修改已有文物

1. 在运行 JSON 中按 `archiveId` 定位条目，修改介绍、年代、尺寸等。
2. 修改名称、英文名、slug 时，同步档案索引和对应解析件中的 `titleZh`、`titleEn`、`assetSlug`、`targetBaseName`。
3. 修改图片时，原图、处理图和缩略图文件名与记录同步。运行数据里的路径保持 `/assets/ceramics/...`，由 `App.jsx` 按 Vite base 解析。
4. 更新 `docs/asset-rights.json` 的来源、授权依据及受影响文件 SHA-256，再运行 `npm run docs:generate` 生成双语清单与检索目录。
5. 执行 `npm run check`，预览受影响的条目和弹窗。

`hiddenFields` 支持：`dynasty`、`period`、`dimensions`、`excavation`、`collection`、`description`、`highlightTags`、`technicalFeatures`、`historicalSignificance`。不确定的内容可隐藏，不应填写看似确定的猜测。数字尺寸不能用负值表示未知；缺失值可用 `null`，必要时隐藏整个尺寸区块。

**隐藏只影响界面，不会删除 JSON 内容，也不能用于隐藏敏感信息。** 敏感内容必须从文件及适用的历史记录中处理。

## 4. 添加一件展品：完整字段示例

以下是虚构的结构示例，不是历史文物资料，也不附带现有书籍图片的使用许可。用自有或明确授权的 PNG 替换示例图片后再接入。现有序号为 001–078，示例使用 079；项目校验不把总数写死为 78。

先准备 `public/assets/ceramics/szk-079-demo-vase.png`。如有去背景图，放入 `public/assets/ceramics/processed/` 的同名文件；没有时不要填写 `processedImageUrl`，页面将使用档案视图。

向 `src/data/shouzhou_ceramics.json` 的数组末尾追加：

```json
{
  "id": "demo-079",
  "archiveId": "szk-079",
  "name": "示例瓶（结构演示）",
  "nameEn": "Demo Vase",
  "assetSlug": "demo-vase",
  "dynasty": "",
  "period": "",
  "dimensions": { "height": null, "mouthDiameter": null, "baseDiameter": null, "unit": "厘米" },
  "excavation": {},
  "collection": {},
  "description": "用于演示数据结构的虚构条目。",
  "highlightTags": ["结构演示"],
  "technicalFeatures": [],
  "historicalSignificance": "",
  "imageUrl": "/assets/ceramics/szk-079-demo-vase.png",
  "thumbnailUrl": "/assets/ceramics/thumbs/szk-079-demo-vase.webp",
  "hiddenFields": ["dynasty", "period", "dimensions", "excavation", "collection", "technicalFeatures", "historicalSignificance"]
}
```

在 `public/assets/ceramics/archive/index.json` 的数组末尾追加：

```json
{
  "id": "demo-079",
  "archiveId": "szk-079",
  "sourceFileName": "demo-vase-original.png",
  "targetBaseName": "szk-079-demo-vase",
  "titleZh": "示例瓶（结构演示）",
  "titleEn": "Demo Vase",
  "assetSlug": "demo-vase",
  "imageUrl": "/assets/ceramics/szk-079-demo-vase.png",
  "processedImageUrl": ""
}
```

新建 `public/assets/ceramics/archive/szk-079.json`：

```json
{
  "archiveId": "szk-079",
  "sourceFileName": "demo-vase-original.png",
  "targetBaseName": "szk-079-demo-vase",
  "titleZh": "示例瓶（结构演示）",
  "titleEn": "Demo Vase",
  "assetSlug": "demo-vase",
  "ocrText": "",
  "catalogSummary": "虚构的结构演示条目。",
  "confidenceNotes": "示例数据，不用于历史事实说明。"
}
```

`sourceFileName` 要改为实际原图的文件名，保持索引和解析件一致。书名、页码、作者、URL 与授权文件另记入来源清单；不要继承其他展品的许可记录。

缩略图维护使用 Python 3.11 和 Pillow 12.3.0。可创建独立环境：

```sh
python -m venv .venv
```

Windows 激活 `.venv\Scripts\Activate.ps1`；macOS/Linux 执行 `source .venv/bin/activate`。激活后执行 `python -m pip install Pillow==12.3.0`，然后生成缩略图：

```sh
python scripts/generate_thumbnails.py
```

脚本会对目录中全部 PNG 生成最长边 320 像素的 WebP，优先使用同名处理图。更新清单后运行 `npm run check`。进入开发页面，检查新条目出现在导航中，并确认图片、名称和资料一致。

## 5. 维护来源清单

`docs/asset-rights.json` 的结构：

| 字段 | 含义 |
| --- | --- |
| `sources` | 来源标识、可核查书目或原始文件线索 |
| `authorizations` | 授权来源、记录日期、用途、正式条款与文件引用 |
| `records` | 每件文物的运行 ID、名称、原文件名和文件关联 |
| `records[].processingMetadata` | 记录的机器提取、加工链与提取日期标记；保留原始值 |
| `records[].files` | `role`、仓库相对路径、`hashMode`、SHA-256 |
| `sharedFiles` | 运行数据、汇总索引和历史截图等跨条目文件 |

每件条目需覆盖 `archive-image`、`thumbnail`、`archive-text`；有处理图时增加 `processed-image`。授权记录必须属于这件素材，不能因为文件格式相同而复用学院授权。新来源使用新的 `sourceReference`，新授权使用新的 `authorizationId`。

清单版本为 `schemaVersion: 2`。现有素材的条目与授权采用 `publicRedistribution: "noncommercial"`，并保留 `commercialUse: "prohibited"`、`recordedOn`、`termsReference` 和 `termsReferenceEn`。条款适用于相应清单内的素材。新增素材应建立其实际来源与授权记录；尚待授权时使用 `not-confirmed`。已获得其他公开分发授权时可以使用 `confirmed` 并提供 `documentReference`。校验检查格式、引用和文件版本；权利范围仍以实际授权为准。

图片采用 `hashMode: "raw-bytes"`；JSON 采用 `hashMode: "utf8-lf"`，计算前将 CRLF 换行统一为 LF，避免 Git 在 Windows/Linux 间切换换行导致误报。文件内容、缩进和字段顺序的变化仍会改变 JSON 哈希。

在根目录计算一个文件的 SHA-256（Windows、Linux、macOS 均可，JSON 自动统一换行）：

```sh
node --input-type=module -e "import fs from 'node:fs'; import {createHash} from 'node:crypto'; const p=process.argv[1]; const b=fs.readFileSync(p); console.log(createHash('sha256').update(p.endsWith('.json')?b.toString('utf8').replace(/\r\n/g,'\n'):b).digest('hex'))" public/assets/ceramics/szk-079-demo-vase.png
```

对解析件、原图、处理图、缩略图以及改动的汇总 JSON 分别更新哈希。不要仅为了让检查通过而批量覆盖哈希，先核实内容及授权对应的版本。封面和截图单独登记在 `docs/assets/manifest.json`，记录来源、用途和原始字节 SHA-256；`rights:check` 同时核对两类清单。更新后执行：

```sh
npm run docs:generate
npm run check
```

删除展品时，同时移除运行条目、索引条目、解析件、独占图片与清单条目；更新汇总文件哈希。仅从导航隐藏不会阻止 `public/` 文件被发布。

## 6. 交互修改与回归

- 主图地址由当前文物直接派生，避免额外 state 在快速切换时显示上一件图片。
- 全屏档案与资料面板使用 `createPortal(..., document.body)`；保留背景滚动锁、Escape 关闭、焦点限制及恢复。
- 弹层开启时，底层方向键导航应暂停。
- 验证首屏加载、连续切换、图片失败回退及无处理图条目。最低验证 1280×720 横向视口；按实际设备增加触控和小屏检查。
- 检查控制台错误、图片加载、遮挡及长文字。编译成功不能证明交互正确。

运行环境中有固定 Playwright 策略时，必须使用其指定命令、浏览器目录及 Chromium 版本，不自动安装另一份浏览器。

## 7. 构建、检查和分发

```sh
npm run check
npm audit
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

`check` 依次检查运行数据、素材清单、生成文档与本地链接，并构建应用。`npm audit` 查询依赖安全公告。

构建部署在网站根路径时可直接使用 `dist/`。部署到子目录（例如 `/kiln/`）时运行 `npm run build -- --base=/kiln/`；通过同一路径访问并检查所有图片。静态服务器应提供正确的 JavaScript MIME 类型。

构建产物在 `dist/`。保留第三方声明；如更新 npm 依赖，应核对 `THIRD_PARTY_NOTICES.md` 的版本表和 `public/THIRD_PARTY_NOTICES.txt` 中的原始许可证正文。授权材料与来源清单变更必须与素材版本一起审查。

## 8. 检索与项目引用

[发现与索引指南](DISCOVERY.md) 介绍 `llms.txt`、机器文物目录和生成命令。[Agent 指南](AGENT_GUIDE.md) 提供定位代码与内容的工作示例。使用 [CITATION.cff](../CITATION.cff) 或 [CodeMeta](../codemeta.json) 引用软件；引用文物资料时附上具体档案标识及其来源记录。
