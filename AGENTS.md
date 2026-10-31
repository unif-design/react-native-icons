# react-native-icons 开发入口

<!-- BEGIN GITHUB DELIVERY STANDARD -->

## 开发入口

本库为 `@unif/react-native-icons`（仓库 `react-native-icons`）。

按当前任务选择适用且已安装的技能；项目约定与库能力以本仓库的实际文档和源码为准。

项目设计、约定和实现入口见[开发资料](docs/DEVELOPMENT.md)。

<!-- END GITHUB DELIVERY STANDARD -->

使用中文交流。

图标名称采用 Outlined / Filled 等实际风格后缀。SVG 是源资源；不手改生成的图标文件。不引入 Design 主题或业务依赖。

维护图形、清单或生成规则时，读取[同源生成](docs/DEVELOPMENT.md#同源生成与跨仓校验)，核对 RN 与鸿蒙目标。目标缺失或只获单端授权时报告待同步范围，不把 RN 检查通过当成两端完成。

共享交付文件由 `github-delivery` 的模板和工具维护，Unif 组织值落实为本库 `.github/organization.json`；受管文件通过技能提供的同步工具维护。项目检查与配置入口见[交付配置与检查](docs/DEVELOPMENT.md#交付配置与检查)。

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
