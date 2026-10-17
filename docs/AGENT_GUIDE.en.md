# Agent reading and development guide

[简体中文](AGENT_GUIDE.md) · [Project home](../README.en.md) · [Discovery guide](DISCOVERY.en.md)

## File navigation

| Task | Start here | Key files |
| --- | --- | --- |
| Understand and use the gallery | [Home](../README.en.md), [user guide](USAGE.en.md) | `src/App.jsx` |
| Find an artifact | [Machine catalog](catalog.json), [source inventory](ASSET_INVENTORY.en.md) | `src/data/shouzhou_ceramics.json` |
| Change interaction or appearance | [Development guide](DEVELOPMENT.en.md) | `src/components/`, `src/index.css`, `tailwind.config.js` |
| Add or correct an artifact | [Field examples](DEVELOPMENT.en.md#4-add-an-artifact-complete-field-examples) | Runtime data, archive index, sidecars and material manifest |
| Check permissions | [Material terms](../ASSET_LICENSE.en.md), [third-party notices](../THIRD_PARTY_NOTICES.en.md) | `LICENSE`, `docs/asset-rights.json` |

Repository conventions are in [AGENTS.md](../AGENTS.md) ([Chinese](../AGENTS.zh-CN.md)). `llms.txt` provides navigation; `llms-full.txt` combines the core bilingual documents.

## Find artifacts and sources

```sh
npm run catalog:search -- szk-003
npm run catalog:search -- "Celadon-glazed"
npm run catalog:search -- 龙柄
```

Results are JSON. Use `archiveId` to locate runtime and archive records. `runtimeId` identifies the UI record; `archiveId` is stable across files. Chinese and English names come directly from runtime data; periods and tags retain their recorded language.

Use source code and observed behavior to explain the application. Cite archive IDs and source records when describing artifacts. Bibliographic editions and printed page numbers have gaps; retain unknown values and do not infer ISBNs or page numbers from filename suffixes. Processing metadata describes the stored record; check images and OCR text against the original archive.

## Install and run

```sh
git clone https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive.git
cd shouzhou-kiln-interactive
npm ci
npm run check
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Use Node.js 22. Open `http://127.0.0.1:4173/`, or choose another port if occupied. Installation requires network access; subsequent builds and previews run locally.

## Content maintenance example

1. Search for `szk-003`; inspect runtime data, archive index and sidecar JSON.
2. After editing fields, check the corresponding images and source records.
3. Synchronize archive references, material records and affected hashes while retaining unchanged source information.
4. Run `npm run docs:generate` and `npm run check`.
5. Inspect both views, the record dialog and fullscreen reader for that artifact.

## Code maintenance example

For a record-dialog change, start with `DataPanel.jsx` and related hooks. Check Portal, Escape, focus and background scrolling. Verify Tab/Shift+Tab cycling, focus restoration on close and paused underlying navigation while open. Check wide and narrow viewports for UI changes; use Chromium according to the environment's fixed Playwright policy.

When validation fails, use the reported path or archive ID to locate and correct the source, then regenerate discovery files. See the [contribution guide](../CONTRIBUTING.en.md) for submission requirements.
