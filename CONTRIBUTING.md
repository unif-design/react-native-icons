# 参与开发

本仓维护 SVG 图标、生成器、原生示例和文档站。使用仓库 `.nvmrc` 与 `package.json` 指定的 Node／Yarn，在根目录执行 `yarn install --immutable`。工程规范及跨平台来源见[开发资料](docs/DEVELOPMENT.md)，交流遵循[行为准则](CODE_OF_CONDUCT.md)，安全问题使用[安全报告入口](SECURITY.md)。

## 修改图标

SVG 源位于 `src/svg/`，公开名称由 `scripts/icon-manifest.json` 定义。修改源文件后运行 `yarn generate`，同步组件、公开出口和 example／website 清单；不要手改生成文件。网站用途分类在 `website/src/components/iconCategories.ts` 维护。

图形与名称同时供 RN 和鸿蒙使用，生成、只读校验及单端任务的边界见[同源生成与跨仓校验](docs/DEVELOPMENT.md#同源生成与跨仓校验)。保留几何、描边、实心细节及无障碍行为，不引入 Design 运行时或业务依赖。

## 验证

```sh
yarn lint
yarn typecheck
yarn test --maxWorkers=2 --coverage
yarn prepare
yarn verify:package
yarn website typecheck
yarn website build
```

`yarn lint` 包含生成一致性检查；`yarn prepare` 会重新生成组件并构建 JS／声明。`verify:package` 验证真实 tarball，复用本地已安装的 peer，不代表独立注册表安装。保留的 CLI `multiply` 示例不进入公开 API 和发布包。

图形或渲染变更还应检查[原生示例](example/README.md)和网站的实际呈现。原生宿主测试、平台编译、浏览器、设备与远端 CI 各自记录结果，不能相互替代。

## 提交与交付

调整公开 API 或既有实现行为前，先通过 issue 与维护者确认范围；已获授权的任务按确认范围执行。提交与 PR 标题、正文使用中文，保留 Conventional Commits 类型前缀。公开 API 变化同步类型、文档和消费者；提交前检查完整差异，保留无关工作区修改。

CI 与发布配置由 `github-delivery` 的模板和工具维护，Unif 组织值落实为本库 `.github/organization.json`；检查入口见[交付配置与检查](docs/DEVELOPMENT.md#交付配置与检查)。正式发行沿用本库 PR、发布机器人和 npm Trusted Publisher 流程，具体交付以当前任务授权为准。
