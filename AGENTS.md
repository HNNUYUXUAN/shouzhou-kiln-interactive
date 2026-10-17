# Repository conventions

[中文](AGENTS.zh-CN.md) · [Agent guide](docs/AGENT_GUIDE.en.md)

- Use Node.js 22 and `npm ci`. Run `npm run check` after changes.
- Runtime content lives in `src/data/shouzhou_ceramics.json`. Keep stable `archiveId` values and align the archive index, sidecars, images and material manifest.
- Preserve the gallery's keyboard navigation, image fallback, dialog focus behavior and responsive layout. Check affected interactions in Chromium when changing UI behavior.
- Use complete Tailwind class literals. Keep generated catalog and documentation output out of runtime imports.
- Update Chinese and English guides together. Run `npm run docs:generate` after editing source guides, material records or artifact data; `npm run docs:check` checks synchronization and local links.
- Preserve source and permission records. Leave unknown bibliographic fields empty. Code and original engineering text use MIT; artifact materials and documentation visuals use the terms linked from `ASSET_LICENSE.en.md`.
- Keep credentials, personal environment paths, build output and working notes outside tracked files. Retain required third-party copyright notices.
- Use the host's approved Playwright installation and Chromium; do not automatically install another browser runtime.
