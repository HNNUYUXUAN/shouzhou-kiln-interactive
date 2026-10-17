# Third-party software and licenses

[简体中文](THIRD_PARTY_NOTICES.md) · [Home](README.en.md)

Versions and SPDX declarations come from `package-lock.json`; license texts come from the corresponding packages. Artifact materials use [separate terms](ASSET_LICENSE.en.md).

## Production dependencies

The following direct and transitive production dependencies have their original license texts in [public/THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt). Vite copies the notices into `dist/`; preserve them when distributing the build.

| Package | Locked version | Declared license |
| --- | --- | --- |
| `js-tokens` | 4.0.0 | MIT |
| `loose-envify` | 1.4.0 | MIT |
| `lucide-react` | 1.11.0 | ISC |
| `object-assign` | 4.1.1 | MIT |
| `prop-types` | 15.8.1 | MIT |
| `react` | 18.3.1 | MIT |
| `react-dom` | 18.3.1 | MIT |
| `react-is` | 16.13.1 | MIT |
| `scheduler` | 0.23.2 | MIT |

Lucide's LICENSE includes ISC and the MIT notice for icons derived from Feather. Both texts are included.

## Styles and build tools

Tailwind CSS 4.3.3 default styles and generated CSS are distributed with the app. Its MIT text is included in the static notices.

| Direct development dependency | Locked version | License |
| --- | --- | --- |
| `@tailwindcss/vite` | 4.3.3 | MIT |
| `@types/react` | 18.3.28 | MIT |
| `@types/react-dom` | 18.3.7 | MIT |
| `@vitejs/plugin-react` | 4.7.0 | MIT |
| `tailwindcss` | 4.3.3 | MIT |
| `vite` | 6.4.3 | MIT |

Third-party licenses in the lockfile include MIT, ISC, BSD-3-Clause, Apache-2.0, CC-BY-4.0 and MPL-2.0. When distributing a toolchain or node_modules, include the corresponding package license files. Synchronize version tables and license texts after dependency changes.

## Optional image tools and fonts

Python 3.11 and Pillow 12.3.0 support optional thumbnail generation. Users install runtime binaries separately; redistribution must follow their licenses and those of included components.

Artifact processing metadata is retained in the [material manifest](docs/asset-rights.json). The thumbnail script is `scripts/generate_thumbnails.py`.

CSS names the Noto Serif SC / Source Han Serif SC font families and falls back to local serif fonts. Include corresponding font licenses when adding font files.
