# 第三方软件与许可

[English](THIRD_PARTY_NOTICES.en.md) · [首页](README.md)

版本与 SPDX 声明来自 `package-lock.json`，许可证正文来自相应包文件。文物素材使用[单独条款](ASSET_LICENSE.md)。

## 运行依赖

以下列出直接与传递生产依赖，其许可证正文收录在 [public/THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt)。Vite 将声明复制到 `dist/`，分发构建时应保留。

| 包 | 锁定版本 | 包声明许可 |
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

Lucide 的 LICENSE 包含 ISC 以及来自 Feather 图标的 MIT 声明，两部分正文均随附。

## 样式与构建工具

Tailwind CSS 4.3.3 的默认样式和生成 CSS 随应用分发，MIT 正文收录在静态声明中。

| 直接开发依赖 | 锁定版本 | 许可 |
| --- | --- | --- |
| `@tailwindcss/vite` | 4.3.3 | MIT |
| `@types/react` | 18.3.28 | MIT |
| `@types/react-dom` | 18.3.7 | MIT |
| `@vitejs/plugin-react` | 4.7.0 | MIT |
| `tailwindcss` | 4.3.3 | MIT |
| `vite` | 6.4.3 | MIT |

锁文件的第三方许可包括 MIT、ISC、BSD-3-Clause、Apache-2.0、CC-BY-4.0 与 MPL-2.0。分发工具链或 node_modules 时，应随附对应包的许可文件。依赖变化时同步版本表与许可证正文。

## 可选图像工具与字体

Python 3.11 与 Pillow 12.3.0 用于可选的缩略图生成。运行时二进制由使用者安装；再分发时遵守各自及附带组件许可。

文物记录中的加工元数据见[素材清单](docs/asset-rights.json)。缩略图脚本位于 `scripts/generate_thumbnails.py`。

CSS 引用 Noto Serif SC / Source Han Serif SC 字体族，使用本机衬线字体回退。添加字体文件时需附相应字体许可。
