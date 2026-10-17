# User guide

[简体中文](USAGE.md) · [Project home](../README.en.md) · [Development guide](DEVELOPMENT.en.md)

## Explore the gallery

Open the [live gallery](https://shouzhou-kiln-interactive.yuxuan.wiki/) and select an artifact from the bottom strip. The left and right arrow keys move between artifacts; the strip's arrow buttons scroll its thumbnails.

“数字资产” displays the processed artifact image; “档案视图” displays the scanned archive. There are 76 artifacts with processed images and 2 that open directly in archive view. Select an archive image to read it in fullscreen and scroll through the page.

Select “查看文物资料” to read dimensions, excavation, collection and technical features. Press `Esc` or use the close button to exit the record panel or fullscreen reader. Use `Tab` and `Shift+Tab` to move focus between dialog controls.

## Run locally

Install Node.js 22 and npm:

```sh
git clone https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive.git
cd shouzhou-kiln-interactive
npm ci
npm run dev -- --host 127.0.0.1
```

The default development address is `http://127.0.0.1:3000/`; use the address printed by the terminal. Initial installation requires access to the npm registry. Running and building require Node.js; Python is used for optional thumbnail generation.

## Build and use offline

```sh
npm run check
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open `http://127.0.0.1:4173/`. Preview serves `dist/`; rebuild after editing source files. Serve `dist/` with an HTTP static server for a website, local machine or intranet. For offline use, install dependencies and build first, then run a local HTTP server. Images are local and fonts use the system font stack.

Browser requirements: Chrome 111+, Safari 16.4+, Firefox 128+. The gallery prioritizes landscape displays and adapts its layout on narrow screens.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Port already in use | Stop the conflicting process or pass a different `--port` to dev/preview |
| Preview shows old content | Run `npm run build` again and refresh |
| An image fails to load | Check image paths, deployment subpath and network; select the retry button after restoring access |
| Opening HTML directly fails | Access `dist/` through an HTTP server |
| Material validation fails | Compare the source manifest, actual file and hash as described in the [development guide](DEVELOPMENT.en.md) |

Materials are available for learning, exchange and noncommercial distribution; see [material terms](../ASSET_LICENSE.en.md).
