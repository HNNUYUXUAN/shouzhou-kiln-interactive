# 仓库开发约定

[English](AGENTS.md) · [Agent 指南](docs/AGENT_GUIDE.md)

- 使用 Node.js 22 与 `npm ci`，修改后运行 `npm run check`。
- 运行内容位于 `src/data/shouzhou_ceramics.json`。保留稳定 `archiveId`，同步档案索引、逐件解析件、图片与素材清单。
- 保留方向键导航、图片回退、弹层焦点行为和响应式布局。更改交互时在 Chromium 中验证受影响的操作。
- Tailwind class 使用完整字面量。生成目录和文档不引入运行时依赖。
- 中英文指南同步维护。修改源指南、素材记录或文物数据后运行 `npm run docs:generate`；`npm run docs:check` 检查生成同步与本地链接。
- 保留来源与授权信息，未知书目字段留空。代码与原创工程文字采用 MIT；文物素材与文档图片使用 `ASSET_LICENSE.md` 所链接的条款。
- 凭据、个人环境路径、构建产物和工作笔记放在跟踪文件之外，保留第三方版权声明。
- 使用所在环境已批准的 Playwright 和 Chromium，不自动安装其他浏览器运行时。
