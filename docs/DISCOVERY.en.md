# Discovery, navigation and citation

[简体中文](DISCOVERY.md) · [Home](../README.en.md) · [Agent guide](AGENT_GUIDE.en.md)

| File | Purpose |
| --- | --- |
| [llms.txt](../llms.txt) | Chinese and English documentation index |
| [llm.txt](../llm.txt) | Compatibility entry with identical contents to llms.txt |
| [llms-full.txt](../llms-full.txt) | Combined core guides, with links to repository files |
| [catalog.json](catalog.json) | Stable artifact IDs, Chinese/English names, periods, tags and related files |
| [asset-rights.json](asset-rights.json) | Material sources, permitted uses and file versions |
| [CITATION.cff](../CITATION.cff), [CodeMeta](../codemeta.json) | Software author, project URL and technical metadata |

Code assistants and retrieval tools can read these files through the repository. The catalog is generated from existing data; the gallery continues to read `src/data/shouzhou_ceramics.json`.

## Generate and check

```sh
npm run docs:generate
npm run docs:check
npm run catalog:search -- szk-003
```

The generator reads runtime JSON, the material manifest and core Markdown, then writes the catalog, bilingual inventories and `llms.txt`, `llm.txt` and `llms-full.txt`. Output order is deterministic and contains no generation timestamp. `--check` compares expected contents and exits nonzero on drift; link checks validate repository-relative links, images and heading anchors. Edit source documents and regenerate derived files.

`catalog:search` accepts IDs, Chinese or English keywords. Multiple words use AND matching. Output is a JSON array, or `[]` for no matches. Run `node scripts/search_catalog.mjs szk-003` from the root for JSON without npm's log prefix.

Catalog `files` are repository-relative paths; `processedImage` is `null` when absent. `runtimeId` and `archiveId` retain the runtime and archive identifiers. `nameZh` and `nameEn` come from source data; `dynasty`, `period` and `tags` retain their recorded language and unknown values remain empty.

## Cite and reuse

Cite the software using 缪雨轩 (Miao Yuxuan), the project title and repository URL, adding a specific commit when needed. For artifacts, include `archiveId` and actual source information from the manifest and follow the [material terms](../ASSET_LICENSE.en.md). MIT code licensing and noncommercial material terms apply to their respective content.
