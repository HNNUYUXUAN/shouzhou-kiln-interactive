# Contributing

[简体中文](CONTRIBUTING.md) · [Development guide](docs/DEVELOPMENT.en.md)

Contributions can improve the gallery, correct artifact information or extend the documentation. Use [issues](https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive/issues) for reproducible problems and proposals.

1. Create a branch and describe the intended result.
2. Use Node.js 22, install with `npm ci`, and run `npm run check`.
3. Keep Chinese and English documentation aligned. Run `npm run docs:generate` when guide text or artifact data changes.
4. For UI changes, check navigation, view switching, fullscreen, dialogs, keyboard focus and narrow screens. Include representative screenshots.
5. For dependencies, run `npm audit` and retain relevant license notices.

Original code and engineering documentation contributions use MIT. For material contributions, provide the original source, applicable rights and terms; update the source manifest, inventory and hashes. Current artifact materials use the noncommercial terms in [ASSET_LICENSE.en.md](ASSET_LICENSE.en.md).

Describe content corrections with the archive ID and supporting reference. Report sensitive information by location and category without copying its value into an issue.
