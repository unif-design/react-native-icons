# 开发资料

设计依据见 [独立图标包设计](superpowers/specs/2026-10-11-icons-design.md)，实施记录见 [计划](superpowers/plans/2026-10-11-icons.md)。

保持官方 CLI 生成的工程结构，在其基础上实现图标、示例和必要接线。源 SVG 位于 src/svg，公开名称由 scripts/icon-manifest.json 明确指定，生成文件位于 src/icons 与 src/index.tsx。维护后运行 yarn generate；业务消费者不执行生成脚本。

首批资源及严格 SVG 校验器源自 react-native-design 4d0ac8743b6e4d49547b2890c51b2dec04423337（MIT），保留原始几何及绘制属性。新库独立后在这里维护资源；Design 消费切换须随新包发布另行交付。

## CI 标准

标准仓 unif-design/.github，采用 main 提交 d91483b7bb09a4d924a592ea434f2a588cc26caa；执行 scripts/sync-repo.sh react-native-icons <本仓绝对路径>。受管 CI 文件不单仓修改。保持 .nvmrc、Yarn、Turbo、example build 及 release-it 的真实接线。官方 CLI 本次 --tools 数组选项仅采用 eslint，Jest、lefthook、release-it 的实际配置已在工程接入时补齐。

本仓尚不在组织 Agent 与 llms 同步脚本的五仓名单中；AGENTS.md 为本库入口，website/scripts/llms 和公共 builder 测试原样来自同一模板修订。正式扩展自动同步应修改标准仓白名单。

## 验证

生成与源资源一致性、组件属性/颜色/图形、类型、打包消费、Metro bundle、网站构建和 CI 静态检查分别验证。iOS/Android 原生编译、设备、远端 CI 及 npm 发布不能互相替代。

## 官网样式

首页直接消费 `@unif/react-native-design@0.40.4/docs-home.css`，仅作为 website 开发依赖。官网只导入该 CSS 出口，不导入 Design 的 JS 组件或主题；图标库自身的运行时与 peer 依赖不变。CSS 包仍声明完整 Design 的原生 peers，安装会显示这些未使用 peers 的提示；不要为仅消费样式而安装原生 UI 依赖。
