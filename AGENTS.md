# react-native-icons 开发入口

使用中文交流。使用 unif-portal-dev-skills 的 code-development，设计、测试、审查、交付按阶段使用同插件技能。实现与验证入口见 [开发资料](docs/DEVELOPMENT.md)。

图标名称采用 Outlined / Filled 等实际风格后缀。SVG 是源资源；不手改生成的图标文件。不引入 Design 主题或业务依赖。

CI 标准来自 unif-design/.github；受管文件通过组织 sync-repo.sh 同步，不单仓修改。新库尚未进入组织 Agent 与 llms 同步脚本白名单，扩展同步范围需在标准仓处理。

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
