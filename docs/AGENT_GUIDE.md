# Agent 阅读与开发指南

[English](AGENT_GUIDE.en.md) · [项目首页](../README.md) · [索引说明](DISCOVERY.md)

## 文件导航

| 任务 | 入口 | 关键文件 |
| --- | --- | --- |
| 了解作品与体验 | [首页](../README.md)、[使用指南](USAGE.md) | `src/App.jsx` |
| 找一件文物 | [机器目录](catalog.json)、[来源清单](ASSET_INVENTORY.md) | `src/data/shouzhou_ceramics.json` |
| 改交互或外观 | [开发指南](DEVELOPMENT.md) | `src/components/`、`src/index.css`、`tailwind.config.js` |
| 新增或修正文物 | [字段示例](DEVELOPMENT.md#4-添加一件展品完整字段示例) | 运行数据、档案索引、逐件解析件与素材清单 |
| 检查许可 | [素材条款](../ASSET_LICENSE.md)、[第三方声明](../THIRD_PARTY_NOTICES.md) | `LICENSE`、`docs/asset-rights.json` |

仓库开发约定见 [AGENTS.md](../AGENTS.md)（[中文](../AGENTS.zh-CN.md)）。`llms.txt` 提供简明导航，`llms-full.txt` 汇集核心双语文档。

## 查找文物与来源

```sh
npm run catalog:search -- szk-003
npm run catalog:search -- "Celadon-glazed"
npm run catalog:search -- 龙柄
```

结果为 JSON，按 `archiveId` 定位运行记录及档案文件。`runtimeId` 用于页面数据，`archiveId` 是跨文件稳定标识。目录中的中英文名称直接来自运行数据，时期与标签保留原语言。

介绍程序行为时以组件源码和运行验证为据；介绍文物时引用档案标识及来源。来源清单的印刷页码和文献版本有空缺；保留未知值，不根据原文件后缀推算页码或 ISBN。加工元数据用于描述所存记录，图片与 OCR 内容需结合原档案核对。

## 安装与运行

```sh
git clone https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive.git
cd shouzhou-kiln-interactive
npm ci
npm run check
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

使用 Node.js 22。打开 `http://127.0.0.1:4173/`。如端口被占用，选择另一个端口。依赖安装需要联网；安装完成后可本地构建、预览。

## 内容维护示例

1. 搜索 `szk-003`，检查运行数据、档案索引和逐件 JSON。
2. 修改字段后，检查对应图片和来源记录。
3. 同步档案关联、素材记录及受影响文件哈希，保留未变的来源信息。
4. 运行 `npm run docs:generate`、`npm run check`。
5. 在浏览器检查该文物的两种视图、资料和全屏阅读。

## 代码维护示例

调整资料弹窗时从 `DataPanel.jsx` 和相关 hook 入手，核对 Portal、Escape、焦点和背景滚动行为。修改后验证 Tab/Shift+Tab 循环、关闭后焦点恢复，以及弹窗打开时底层导航暂停。界面改动同时检查宽屏和窄屏；固定 Playwright 环境按其既有策略使用 Chromium。

检查失败时，按报错的文件路径或档案标识定位源文件，修正后重新生成导览。提交要求见[贡献指南](../CONTRIBUTING.md)。
