# 贡献指南

[English](CONTRIBUTING.en.md) · [开发指南](docs/DEVELOPMENT.md)

欢迎改进展台、纠正文物资料和完善文档。可复现的问题与功能建议请提交到[项目 Issues](https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive/issues)。

1. 创建分支，说明预期结果。
2. 使用 Node.js 22，执行 `npm ci` 和 `npm run check`。
3. 保持中英文文档对应；指南或文物数据变化后执行 `npm run docs:generate`。
4. 界面改动需检查导航、视图切换、全屏、弹窗、键盘焦点及窄屏，并附代表性截图。
5. 依赖改动执行 `npm audit`，保留相应许可声明。

原创代码和工程文档贡献采用 MIT。素材贡献需提供原始来源、相应权利和适用条款，同步来源清单、逐件目录和哈希。现有文物素材遵循[非商用使用范围](ASSET_LICENSE.md)。

内容纠错请注明档案 ID 和依据。敏感信息问题仅报告位置与类别，避免将原值复制到 Issue。
