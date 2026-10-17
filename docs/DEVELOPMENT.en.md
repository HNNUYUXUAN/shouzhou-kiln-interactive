# Development guide

[简体中文](DEVELOPMENT.md) · [Project home](../README.en.md) · [Agent guide](AGENT_GUIDE.en.md)

Run commands from the project root. Install Node.js 22, run `npm ci`, then start development with `npm run dev -- --host 127.0.0.1`.

## 1. Understand the data flow

```text
src/data/shouzhou_ceramics.json
  → App.jsx resolves image paths, selected artifact and view
  → ArtifactRail provides artifact navigation
  → CeramicDisplay renders images and the fullscreen archive
  → DataPanel renders the artifact record dialog
```

`public/assets/ceramics/archive/index.json` and the individual `szk-*.json` files preserve source records. The UI reads the runtime JSON; validation keeps these records aligned with it.

Vite copies everything in `public/` into the static build, including archive JSON files. Choose content and images with appropriate rights; see [material terms](../ASSET_LICENSE.en.md).

## 2. Customize the gallery appearance

Tailwind CSS 4.3 uses `@tailwindcss/vite` in `vite.config.js`. `src/index.css` loads the JavaScript theme with `@config` and defines scanning paths with `@source`. Write complete class literals so the generator can discover them.

View buttons use sRGB gradients; the record dialog uses 4px backdrop blur, and text line height is responsive. Check buttons, dialogs and long text after changing the theme.

| Goal | File | Location |
| --- | --- | --- |
| Browser title | `index.html` | `<title>` |
| Chinese and English gallery name | `src/App.jsx` | Header and subtitle |
| Celadon and bronze colors | `tailwind.config.js` | `theme.extend.colors` |
| Fonts, animations and touch rules | `src/index.css` | Global styles |
| Thumbnail strip scroll distance | `src/constants/index.js` | `RAIL_SCROLL_STEP` |
| Main image and fullscreen view | `src/components/CeramicDisplay.jsx` | Image and Portal overlay |
| Artifact record fields | `src/components/DataPanel.jsx` | `ValuePair` and sections |

The font stack uses locally installed fonts. Include license notices when adding font files or third-party icons.

## 3. Edit an artifact

1. Locate the runtime record by `archiveId`; edit its description, period or dimensions.
2. When changing its name, English name or slug, synchronize `titleZh`, `titleEn`, `assetSlug` and `targetBaseName` in the archive index and sidecar record.
3. Align image filenames and references. Runtime paths start with `/assets/ceramics/`; `App.jsx` resolves the Vite base path.
4. Update sources, authorization and affected SHA-256 values in `docs/asset-rights.json`; run `npm run docs:generate` to refresh inventories and discovery files.
5. Run `npm run check` and inspect the affected artifact and dialog in the browser.

`hiddenFields` supports `dynasty`, `period`, `dimensions`, `excavation`, `collection`, `description`, `highlightTags`, `technicalFeatures` and `historicalSignificance`. Hide uncertain fields instead of guessing. Use `null` for unknown numeric dimensions; negative numbers are invalid. Hide the dimensions section if appropriate.

**Hiding a field changes presentation only: the JSON remains downloadable.** Remove sensitive content from files and any applicable history.

## 4. Add an artifact: complete field examples

The following fictional entry demonstrates structure. Supply your own or appropriately licensed PNG. Current IDs run from 001 to 078; the example uses 079. Validators derive the record count from data.

Create `public/assets/ceramics/szk-079-demo-vase.png`. An optional background-removed image goes in `public/assets/ceramics/processed/` with the same filename. If unavailable, omit `processedImageUrl`; the gallery uses archive view.

Append to `src/data/shouzhou_ceramics.json`:

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

Append to `public/assets/ceramics/archive/index.json`:

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

Create `public/assets/ceramics/archive/szk-079.json`:

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

Replace `sourceFileName` with the actual source filename, consistently in the index and sidecar. Record bibliographic details, page, author, URL and authorization document in the source manifest. Associate each new artifact with its own applicable permission record.

Thumbnail maintenance uses Python 3.11 and Pillow 12.3.0. Create an optional environment:

```sh
python -m venv .venv
```

On Windows activate `.venv\Scripts\Activate.ps1`; on macOS/Linux run `source .venv/bin/activate`. Then run `python -m pip install Pillow==12.3.0` and:

```sh
python scripts/generate_thumbnails.py
```

The script generates WebP thumbnails from all PNGs in the directory, preferring processed images with matching names. Their longest edge is at most 320 pixels. Update hashes, regenerate documentation and run `npm run check`. Check the new navigation item, image, title and record in the browser.

## 5. Maintain sources and file versions

`docs/asset-rights.json` uses these fields:

| Field | Meaning |
| --- | --- |
| `sources` | Source IDs, verifiable bibliography or original file clues |
| `authorizations` | Authorization source, recording date, uses, terms and document references |
| `records` | Runtime ID, title, original filename and related files for each artifact |
| `records[].processingMetadata` | Recorded extraction and processing metadata; retain the original values |
| `records[].files` | `role`, repository-relative path, `hashMode` and SHA-256 |
| `sharedFiles` | Runtime data, archive index and shared reference images |

Each artifact covers `archive-image`, `thumbnail` and `archive-text`; add `processed-image` when present. Use a new `sourceReference` for a new source and a new `authorizationId` for a new authorization. Permissions belong to the referenced materials.

The manifest uses `schemaVersion: 2`. Existing records and their authorization use `publicRedistribution: "noncommercial"`, with `commercialUse: "prohibited"`, `recordedOn`, `termsReference` and `termsReferenceEn`. Terms cover the corresponding listed materials. Record actual sources and permissions for additions. Use `not-confirmed` while permission is pending. For other confirmed public redistribution permission, use `confirmed` and supply `documentReference`. Validation checks structure, references and file versions; the actual authorization determines permitted uses.

Images use `hashMode: "raw-bytes"`. JSON uses `hashMode: "utf8-lf"`: normalize CRLF to LF before hashing. JSON formatting, content and key order still affect hashes.

Compute one SHA-256 value from the root (Windows, Linux or macOS):

```sh
node --input-type=module -e "import fs from 'node:fs'; import {createHash} from 'node:crypto'; const p=process.argv[1]; const b=fs.readFileSync(p); console.log(createHash('sha256').update(p.endsWith('.json')?b.toString('utf8').replace(/\r\n/g,'\n'):b).digest('hex'))" public/assets/ceramics/szk-079-demo-vase.png
```

Update affected sidecars, images, thumbnails and aggregate JSON hashes after checking the contents and relevant permissions. Cover art and screenshots have a separate `docs/assets/manifest.json`, recording source, use and raw-byte SHA-256. `rights:check` validates both registries. Then run:

```sh
npm run docs:generate
npm run check
```

To remove an artifact, remove its runtime and index entries, sidecar, exclusively used images and manifest entry, then update shared file hashes. Files left in `public/` remain part of the static build.

## 6. Interaction changes and regression checks

- Derive image addresses directly from the current artifact to avoid stale images during rapid navigation.
- Fullscreen and record dialogs use `createPortal(..., document.body)`. Preserve background scroll lock, Escape and focus restoration in both. The record dialog also traps Tab/Shift+Tab focus.
- Pause underlying arrow-key navigation while a dialog is open.
- Check initial loading, rapid switching, failed-image fallback and artifacts without processed images. Test at least a 1280×720 landscape viewport and add touch/narrow-screen checks for target devices.
- Inspect console errors, image loading, overlapping controls and long text.

If the environment specifies a fixed Playwright runtime, use its approved command, browser directory and Chromium version without automatically installing another browser.

## 7. Build, check and distribute

```sh
npm run check
npm audit
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

`check` validates runtime data, material manifests, generated documentation and local links, then builds the app. `npm audit` checks dependency advisories.

Serve `dist/` at a website root. For a subpath such as `/kiln/`, build with `npm run build -- --base=/kiln/`, access that same path and check all images. Configure the static server to return the correct JavaScript MIME type.

Preserve third-party notices when distributing the build. After dependency changes, update the version table in [third-party notices](../THIRD_PARTY_NOTICES.en.md) and retain original license texts in `public/THIRD_PARTY_NOTICES.txt`. Review source and permission records with the corresponding material version.

## 8. Discovery and citation

The [discovery guide](DISCOVERY.en.md) covers `llms.txt`, the machine-readable artifact catalog and generation commands. The [Agent guide](AGENT_GUIDE.en.md) provides code and content navigation examples. Cite the software with [CITATION.cff](../CITATION.cff) or [CodeMeta](../codemeta.json). Cite artifact information with its archive ID and corresponding source record.
