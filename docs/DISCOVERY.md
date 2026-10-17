# 检索、导览与引用

[English](DISCOVERY.en.md) · [首页](../README.md) · [Agent 指南](AGENT_GUIDE.md)

| 文件 | 用途 |
| --- | --- |
| [llms.txt](../llms.txt) | 中英文文档导航 |
| [llm.txt](../llm.txt) | 与 llms.txt 内容相同的兼容入口 |
| [llms-full.txt](../llms-full.txt) | 核心双语指南合并文本；文档链接指向仓库文件 |
| [catalog.json](catalog.json) | 文物稳定标识、中英文名称、时期、标签和关联文件 |
| [asset-rights.json](asset-rights.json) | 逐件素材的来源、用途和文件版本 |
| [CITATION.cff](../CITATION.cff)、[CodeMeta](../codemeta.json) | 软件作者、项目网址与技术元数据 |

这些文件供代码助手和检索工具读取，需通过仓库访问。文物目录从现有数据生成；展台仍读取 `src/data/shouzhou_ceramics.json`。

## 生成与检查

```sh
npm run docs:generate
npm run docs:check
npm run catalog:search -- szk-003
```

生成脚本读取运行 JSON、素材清单和核心 Markdown，写入目录、双语人读清单及`llms.txt`、`llm.txt` 和 `llms-full.txt`。输出具有固定顺序，不带生成时间。`--check` 比较预期内容，发现过期文件时返回非零退出码；链接检查验证仓库相对链接、图片和标题锚点。修改生成文件的来源后重新生成。

`catalog:search` 接受标识、中文或英文关键词；多个词使用“同时包含”匹配，结果输出 JSON 数组，无匹配时为 `[]`。从项目根目录直接执行 `node scripts/search_catalog.mjs szk-003` 可取得不带 npm 日志的 JSON。

目录字段 `files` 是仓库相对路径，`processedImage` 无值时为 `null`。`runtimeId` 与 `archiveId` 分别保留运行与档案标识。`nameZh`、`nameEn` 来自原数据；`dynasty`、`period`、`tags` 保持记录语言，原数据缺项时保留空值。

## 引用与再用

引用软件时使用缪雨轩与项目标题、仓库网址，必要时附具体提交标识。引用文物时附 `archiveId` 和来源清单中的实际信息，遵守[素材条款](../ASSET_LICENSE.md)。MIT 代码许可与非商用素材条款分别适用。
