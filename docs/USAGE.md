# 使用指南

[English](USAGE.en.md) · [项目首页](../README.md) · [开发指南](DEVELOPMENT.md)

## 浏览展台

打开[在线展台](https://shouzhou-kiln-interactive.yuxuan.wiki/)，在底部导航选择文物。左右方向键切换前后展品，导航两侧按钮滚动缩略图列表。

“数字资产”展示处理后的器物图像，“档案视图”展示扫描页。76 件文物有处理图，另 2 件直接显示档案。点击档案图进入全屏阅读，上下滚动查看扫描页。

点击“查看文物资料”阅读尺寸、出土、馆藏与工艺信息。按 `Esc` 或使用关闭按钮退出资料面板与全屏阅读。在资料弹窗中，`Tab` 和 `Shift+Tab` 可循环移动焦点。

## 本地启动

准备 Node.js 22 和 npm：

```sh
git clone https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive.git
cd shouzhou-kiln-interactive
npm ci
npm run dev -- --host 127.0.0.1
```

默认开发地址为 `http://127.0.0.1:3000/`，以终端实际输出为准。首次安装需要访问 npm 包源。日常使用与构建只需要 Node.js；Python 用于可选的缩略图生成。

## 构建与离线访问

```sh
npm run check
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

访问 `http://127.0.0.1:4173/`。预览读取 `dist/`；修改源码后重新构建。可将 `dist/` 交给 HTTP 静态服务器，在网站、本机或内网提供访问。离线环境先完成依赖安装和构建，再通过本地 HTTP 服务使用。页面使用本地图片和系统字体。

浏览器要求：Chrome 111+、Safari 16.4+、Firefox 128+。展台优先适配横向展示，窄屏按响应式布局排列内容。

## 常见问题

| 情况 | 处理方法 |
| --- | --- |
| 端口占用 | 停止占用进程，或给 dev/preview 传入另一个 `--port` |
| 预览还是旧内容 | 重新执行 `npm run build`，再刷新浏览器 |
| 图片加载失败 | 检查图片路径、部署子路径与网络，恢复后点击“重试加载” |
| 直接打开 HTML 不能正常加载 | 通过 HTTP 服务访问 `dist/` |
| 素材校验失败 | 按报错核对来源清单、实际文件与哈希，见[开发指南](DEVELOPMENT.md) |

素材用于交流学习和非商用分发，详见[素材使用说明](../ASSET_LICENSE.md)。
