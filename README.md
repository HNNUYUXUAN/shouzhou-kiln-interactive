# 寿州窑文物数字展台

[English](README.en.md) · **[进入在线展台 ↗](https://shouzhou-kiln-interactive.yuxuan.wiki/)** · [本地运行](#本地运行) · [二次开发](docs/DEVELOPMENT.md)

![青瓷器物、窑火与窑洞构成的寿州窑主题插画](docs/assets/shouzhou-kiln-cover.png)

*寿州窑主题插画 · [来源与使用说明](docs/assets/README.md)*

寿州窑文物数字展台收录 **78 件文物**，可浏览器物图像、对照档案扫描页，查阅尺寸、出土与馆藏资料。

展台使用 React 开发，数据和图片保存在本地文件中，可部署为静态网站。替换 JSON 和图片即可用于其他展览。

**78 件文物 · 76 张处理图 · 档案对照 · 全屏阅读 · 本地静态部署**

## 浏览文物

打开[在线展台](https://shouzhou-kiln-interactive.yuxuan.wiki/)，在底部导航选择一件文物。主展台显示器物图像、中英文名称、介绍和特征标签。按左右方向键切换文物。

![展台实景：青釉四系龙柄盘口壶、展品介绍与底部文物导航](docs/assets/gallery.png)

*展台截图：青釉四系龙柄盘口壶（szk-003）。点击图片可查看大图。*

| 图片与档案切换 | 文物资料 |
| --- | --- |
| ![档案视图展示同一件文物的扫描页和介绍](docs/assets/archive-view.png) | ![文物资料面板展示尺寸、出土、馆藏和工艺信息](docs/assets/artifact-details.png) |
| 在“数字资产”与“档案视图”之间切换，结合处理图和扫描页阅读；仅有档案图的展品直接显示档案。 | 点击“查看文物资料”，集中阅读尺寸、出土与流传、馆藏和工艺信息。 |

<details>
<summary><strong>展开查看：全屏阅读档案</strong></summary>

点击档案图进入全屏阅读，查看扫描页上的器物和文字。按 `Esc` 或点击关闭按钮返回展台。

![全屏档案阅读器展示扫描页的文字与器物细节](docs/assets/archive-fullscreen.png)

</details>

## 本地运行

准备 **Node.js 22** 和 npm，在终端执行：

```sh
git clone https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive.git
cd shouzhou-kiln-interactive
npm ci
npm run dev -- --host 127.0.0.1
```

浏览器打开终端显示的地址，默认是 [http://127.0.0.1:3000/](http://127.0.0.1:3000/)。日常开发时，保存源码即可查看更新。

生成可部署的静态文件并在本地预览：

```sh
npm run check
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

打开 [http://127.0.0.1:4173/](http://127.0.0.1:4173/)。`dist/` 可交给 HTTP 静态服务器提供访问，也可以在本机或内网部署。

**技术栈：** React 18 · Vite 6 · Tailwind CSS 4。浏览器要求：Chrome 111+、Safari 16.4+、Firefox 128+。

## 使用与开发文档

| 内容 | 文档 |
| --- | --- |
| 浏览展台 | [在线展台](https://shouzhou-kiln-interactive.yuxuan.wiki/) · [使用指南](docs/USAGE.md) |
| 替换或添加展品 | [二次开发教程](docs/DEVELOPMENT.md)：运行数据、图片与档案的对应关系 |
| 调整配色与布局 | [外观开发入口](docs/DEVELOPMENT.md#2-修改展台名称与外观)：主题配置、全局样式与组件 |
| Agent 开发 | [Agent 指南](docs/AGENT_GUIDE.md) · [检索与引用](docs/DISCOVERY.md) · [llms.txt](llms.txt) |
| 查阅素材来源 | [逐件素材清单](docs/ASSET_INVENTORY.md)与[机器可读清单](docs/asset-rights.json) |
| 贡献改进或反馈问题 | [贡献指南](CONTRIBUTING.md) · [项目 Issues](https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive/issues) |

## 许可与致谢

**代码与原创工程文档采用 [MIT](LICENSE)**，作者为 **缪雨轩**。可复用展台代码开发其他主题，保留版权和许可声明。

**文物素材允许非商用分发，仅供交流学习。** 素材授权来源为淮南师范学院美术与设计学院，范围见[素材使用说明](ASSET_LICENSE.md)。商业项目请使用适合该用途的素材。

感谢淮南师范学院美术与设计学院提供素材使用授权。项目使用的第三方软件见[依赖与许可清单](THIRD_PARTY_NOTICES.md)，首页图片来源见[视觉素材说明](docs/assets/README.md)。
