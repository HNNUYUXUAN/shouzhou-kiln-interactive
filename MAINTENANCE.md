# 维护说明

[English](MAINTENANCE.en.md) · [Agent 指南](docs/AGENT_GUIDE.md)

维护者为缪雨轩。项目用于文博展示与技术交流，维护重点是可复现的问题、内容纠错和小范围改进。

## 常用命令

```sh
npm ci
npm run docs:generate
npm run check
npm audit
```

`check` 校验数据、素材版本、文档索引及本地链接，并完成构建。Python 3.11 和 Pillow 12.3 用于可选的缩略图重建。

## 程序约定

- 图片路径由当前文物和视图派生，文物变化时同步图片组件 key。
- 保留图片回退与重试行为。
- 弹层通过 Portal 挂载，锁定背景滚动，处理 Escape 并恢复焦点。
- 运行数据、档案索引、逐件解析件与图片保持同步。
- Tailwind class 使用完整字面量，供 Vite 插件扫描。

依赖变化时检查锁文件并同步第三方声明。内容变化时先更新来源与文件哈希，再生成检索文件。浏览器要求见[使用指南](docs/USAGE.md)。
