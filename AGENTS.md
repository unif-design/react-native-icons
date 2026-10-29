# react-native-icons 开发入口

<!-- BEGIN UNIF REACT NATIVE STANDARD -->

## 开发入口

本仓库为 `react-native-icons`，使用 `unif-portal-dev-skills` 的共用研发规范与库能力技能。

- 本库能力的使用、维护和排障使用 `unif-portal-dev-skills:unif-icons`，只读取当前任务相关资料。
- 实际开发和修改源码时使用 `unif-portal-dev-skills:code-development`；单纯接口查询不启动开发阶段。
- 设计、测试、审查、交付分别使用同插件的 architecture-design、code-testing、code-review、code-delivery，按需读取所属专题。
- 项目设计、规范来源及实现入口见[开发资料](docs/DEVELOPMENT.md)。

<!-- END UNIF REACT NATIVE STANDARD -->

使用中文交流。

图标名称采用 Outlined / Filled 等实际风格后缀。SVG 是源资源；不手改生成的图标文件。不引入 Design 主题或业务依赖。

维护图形、清单或生成规则时，读取[同源生成](docs/DEVELOPMENT.md#同源生成与跨仓校验)，核对 RN 与鸿蒙目标。目标缺失或只获单端授权时报告待同步范围，不把 RN 检查通过当成两端完成。

CI 标准来自 unif-design/.github；受管文件通过组织同步脚本维护，不单仓修改。Agent 入口与 llms 公共生成实现已纳入共享同步名单。

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
