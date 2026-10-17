# Shouzhou Kiln Interactive Gallery

[简体中文](README.md) · **[Explore the live gallery ↗](https://shouzhou-kiln-interactive.yuxuan.wiki/)** · [Run locally](#run-locally) · [Development guide](docs/DEVELOPMENT.en.md)

![Thematic illustration of celadon vessels, kiln arches and the glow of firing](docs/assets/shouzhou-kiln-cover.png)

*Shouzhou kiln thematic illustration · [Source and usage notes](docs/assets/README.md)*

This gallery presents **78 Shouzhou kiln artifacts**. Browse artifact images, compare scanned archive pages, and read dimensions, excavation and collection records.

Built with React, the gallery stores its data and images in local files and can be deployed as a static website. Replace the JSON and images to use it for another exhibition.

**78 artifacts · 76 processed images · Archival comparison · Fullscreen reading · Static deployment**

## Browse artifacts

Open the [live gallery](https://shouzhou-kiln-interactive.yuxuan.wiki/) and choose an artifact from the navigation strip. The main stage combines its image, Chinese and English names, description and feature tags. Use the left and right arrow keys to continue browsing.

![Live application showing a celadon-glazed jar with four loops and a dragon handle, its description and the artifact navigation strip](docs/assets/gallery.png)

*Application screenshot: celadon-glazed dish-mouthed jar with four loops and dragon handle (szk-003). Open the image for a larger view.*

| Image and archive views | Artifact records |
| --- | --- |
| ![Archive view displaying the scanned page alongside the artifact description](docs/assets/archive-view.png) | ![Artifact record panel displaying dimensions, excavation, collection and technical features](docs/assets/artifact-details.png) |
| Switch between the processed image (“数字资产”) and archive view (“档案视图”). Artifacts with an archive image only open directly in archive view. | Select “查看文物资料” to read the dimensions, excavation and provenance, collection and technical features together. |

<details>
<summary><strong>Expand: read the archive in fullscreen</strong></summary>

Select the archive image to open the scanned page in fullscreen. Press `Esc` or use the close button to return to the gallery.

![Fullscreen archive reader displaying text and artifact details on a scanned page](docs/assets/archive-fullscreen.png)

</details>

## Run locally

Install **Node.js 22** and npm, then run:

```sh
git clone https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive.git
cd shouzhou-kiln-interactive
npm ci
npm run dev -- --host 127.0.0.1
```

Open the address printed in the terminal, usually [http://127.0.0.1:3000/](http://127.0.0.1:3000/). During development, saving a source file updates the preview.

Build the static site and preview it locally:

```sh
npm run check
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/). Serve `dist/` through an HTTP static server for a hosted site, local installation or intranet deployment.

**Stack:** React 18 · Vite 6 · Tailwind CSS 4. Browser requirements: Chrome 111+, Safari 16.4+, Firefox 128+.

## Usage and development guides

| Topic | Documentation |
| --- | --- |
| Browse the gallery | [Live gallery](https://shouzhou-kiln-interactive.yuxuan.wiki/) · [User guide](docs/USAGE.en.md) |
| Replace or add artifacts | [Development guide](docs/DEVELOPMENT.en.md): connect runtime data, images and archive records |
| Customize colors and layout | [Appearance guide](docs/DEVELOPMENT.en.md#2-customize-the-gallery-appearance): theme settings, global styles and components |
| Agent development | [Agent guide](docs/AGENT_GUIDE.en.md) · [Discovery and citation](docs/DISCOVERY.en.md) · [llms.txt](llms.txt) |
| Find material sources | [Artifact inventory](docs/ASSET_INVENTORY.en.md) and [machine-readable manifest](docs/asset-rights.json) |
| Contribute or report an issue | [Contribution guide](CONTRIBUTING.en.md) · [Project issues](https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive/issues) |

## Licensing and acknowledgments

**Code and original engineering documentation are licensed under [MIT](LICENSE)**, authored by **缪雨轩 (Miao Yuxuan)**. Reuse the gallery code for other themes while retaining the copyright and license notices.

**Artifact materials may be distributed for noncommercial learning and exchange.** Material authorization comes from the School of Art and Design, Huainan Normal University (淮南师范学院美术与设计学院); see the [material terms](ASSET_LICENSE.en.md). For commercial projects, use materials licensed for that purpose.

Thanks to the School of Art and Design, Huainan Normal University, for authorizing the use of the materials. See [third-party software notices](THIRD_PARTY_NOTICES.en.md) and the [visual asset notes](docs/assets/README.md) for software credits and the images used on this page.
