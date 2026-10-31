# 开发资料

设计依据见 [独立图标包设计](superpowers/specs/2026-10-11-icons-design.md)，实施记录见 [计划](superpowers/plans/2026-10-11-icons.md)。

保持官方 CLI 生成的工程结构，在其基础上实现图标、示例和必要接线。源 SVG 位于 src/svg，公开名称由 scripts/icon-manifest.json 明确指定，生成文件位于 src/icons 与 src/index.tsx。维护后运行 yarn generate；业务消费者不执行生成脚本。

首批资源及严格 SVG 校验器源自 react-native-design 4d0ac8743b6e4d49547b2890c51b2dec04423337（MIT），保留原始几何及绘制属性。独立后在本仓维护资源；应用与组件库通过公开 npm 入口消费。

## 同源生成与跨仓校验

`src/svg/` 与 `scripts/icon-manifest.json` 同时服务 RN 和纯 ArkUI Icons。`build-icons.cjs` 默认生成 RN；`--target harmony` 调用鸿蒙生成器，仅更新目标仓的图形数据、命名组件、公开入口、示例清单和溯源资源。手写 ArkUI 渲染器、工程配置及业务组件保持各自归属。

图形、清单或生成规则变化后，在本仓执行：

```sh
yarn generate
node scripts/build-icons.cjs --target harmony --output ../harmony-icons
yarn check:icons:all --harmony-root ../harmony-icons
node --test scripts/build-icons.test.cjs scripts/build-harmony-icons.test.cjs
```

路径按实际工作区传入；`check:icons:all` 只读检查两个真实目标，缺少鸿蒙仓会失败，不下载仓库、不自动生成或跳过。生成完成后审查差异；仅 RN 参数、渲染或无障碍行为变化，仍需按契约核对另一端，不用 SVG 生成替代原生实现。普通图标消费不执行生成。

鸿蒙 `icon-provenance.json` 记录生成时的源提交及 SVG／清单／生成器摘要。只读检查允许提交号因文档提交或等价合并而不同，内容摘要与实际生成文件必须一致。提交号是源码定位依据；内容是否一致由摘要和完整产物比较判定。

RN main 是功能与图形基线，鸿蒙跟进 RN；两端版本号对齐所采用的 RN Icons 版本。RN 的现有 CI 通过 `yarn test` 执行生成器回归，不依赖鸿蒙 main 的进度。鸿蒙仓的专属检查读取 RN main，核对其实际生成产物；这些检查不提交或发布。

鸿蒙升级先核对 RN main 的当前行为与版本，再固定本次对齐的具体提交，生成、检查和构建 HAR。提交号用于复现来源，不能把资源一致当成平台行为已验收。RN PR 可独立提交；RN 合并后再更新鸿蒙来源与产物。单端任务或目标仓缺失时报告待同步范围，不把单端检查结果扩展成双端完成。

## 库能力技能

使用 `unif-portal-dev-skills:unif-icons` 定位当前版本的公开能力、接入与排障资料。应用仅消费库时可直接查公开类型和文档，无需先取得维护工作区。

通用规范使用 `uni-skills`：`code-organization` 说明目录与文件组织，`react-native-development` 说明 RN 实现要求，`react-native-library` 说明独立库与消费者验证，`documentation` 说明文档与文档站维护。Unif 的设计、测试、审查和交付按 `unif-portal-dev-skills` 对应技能执行；本库接口与行为以公开类型和有效契约为准。

## CI 标准

初始工程接入采用组织标准修订 `d91483b7bb09a4d924a592ea434f2a588cc26caa`；当前维护来源与检查见[交付配置与检查](#交付配置与检查)。受管 CI 文件从来源更新并同步。保持 .nvmrc、Yarn、Turbo、example build 及 release-it 的真实接线。官方 CLI 本次 --tools 数组选项仅采用 eslint，Jest、lefthook、release-it 的实际配置已在工程接入时补齐。

`AGENTS.md` 共享区块、`website/scripts/llms` 与公共 builder 测试由 `github-delivery` 提供的同步工具维护，LLM 维护源为该技能的 `templates/llms`。单独更新入口或文档工具时使用对应同步工具；本库通过 `node website/scripts/build-llms.js` 生成资料。

## 验证

库开发、Community CLI example 和 Website 统一采用 React 19.3.0／RN 0.88.0；CLI 20.2.0 与原生 example 按官方 `@react-native-community/template@0.88.0` 同步。Yarn 在根目录提升同版本依赖，保证库与 example 使用同一 React 实例。iOS 采用 SceneDelegate 启动 React，Android 采用 SDK 37、Kotlin 2.2.0、Gradle 9.4.1 及模板的 AGP 9 兼容开关。

SVG 使用 `15.16.0` 的正式 RN 0.87+ 资源解析修复；Website 按上游 Webpack 说明显式安装 `@react-native/assets-registry@0.88.0`，配合 RN Web 0.21.4 [正式公开的 AssetRegistry](https://github.com/necolas/react-native-web/releases/tag/0.21.4)；该兼容包的混合模块格式由 Babel 转换，共享 Web 消费者的资产注册表。

Jest 覆盖所有 `src/**/*.{ts,tsx}`（包含生成图标和保留的 CLI 示例）及 `example/src/**/*.{ts,tsx}`，四项覆盖率门禁均为 100%。生成器、SVG 解析器、打包验证器与文档工具使用各自测试，不并入运行时覆盖率。两端原生 example 仅保留官方模板宿主，没有本库自有原生模块；宿主构建与真机展示须单独验证。

生成与源资源一致性、组件属性/颜色/图形、类型、打包消费、Metro bundle、网站构建和 CI 静态检查分别验证。iOS/Android 原生编译、设备、远端 CI 及 npm 发布不能互相替代。

## SVG Web 版本与平台支持

原生库与 example 继续使用正式 `react-native-svg@15.16.0`；Website 单独固定正式 `15.15.5`，并从 Website 的依赖解析 SVG。15.16.0 的 Android 音效依赖会进入 Webpack 的 Web 模块图（[上游问题 #3086](https://github.com/software-mansion/react-native-svg/issues/3086)）；15.15.5 的 Web 实现不包含这条依赖。该选择只影响文档站，保留原生 15.16.0 的资源解析修复。

不使用 Yarn 依赖补丁或 SVG IgnorePlugin，不关闭导出警告。升级 Website 的 SVG 版本前，验证完整站点构建、SVG 图形／渐变／裁剪、点击与卸载。切换版本后先执行 `yarn workspace @unif/react-native-icons-website exec docusaurus clear`，再执行该 workspace 的 `build`，避免复用旧构建缓存。

支持 Web 的组件继续通过真实 React Native Web 实现演示；只有没有 Web 实现的原生 SDK 能力提示到 iOS／Android 示例体验。构建或类型错误不能直接作为“不支持 Web”的判断依据。RN 整库类型改造已停止，本仓未应用 RN 源码或类型补丁。

`node --test scripts/svg-web.test.cjs` 通过实际站点插件打包 SVG，断言无导出警告、无 Android 音效模块，并验证 SVG／Defs／渐变／圆形的真实 SSR 输出；该回归纳入常规 `yarn test`。浏览器和真机验证仍须分别记录。

## 官网样式

首页直接消费 `@unif/react-native-design@0.40.4/docs-home.css`，仅作为 website 开发依赖。官网只导入该 CSS 出口，不导入 Design 的 JS 组件或主题；图标库自身的运行时与 peer 依赖不变。CSS 包仍声明完整 Design 的原生 peers，安装会显示这些未使用 peers 的提示；不要为仅消费样式而安装原生 UI 依赖。

### 原生宿主与构建工具

iOS example 使用 Ruby 3.3+，`example/Gemfile.lock` 固定 CocoaPods 1.17.0、ActiveSupport 7.2.4 与 xcodeproj 1.28.1；在 `example/` 执行 `bundle install`，再到 `example/ios/` 执行 `bundle exec pod install --deployment`。提交的 Podfile.lock 与实际 RN 0.88 构建一致。该组合已通过真实 iOS 设备 SDK 的无签名 Debug 编译；Android example 的 `:app:assembleDebug -PreactNativeArchitectures=arm64-v8a` 已通过。设备安装、交互和远端 CI 另行验收。

`yarn test:native` 直接插桩 example 的两个 Kotlin 文件以及 AppDelegate／SceneDelegate 原始 Swift 文件，分别执行 Swift Debug 和 Release。测试替换外部 RN／UIKit 接口，断言宿主启动、依赖与窗口接线、场景筛选、链接转发及资源查找；Android 断言宿主延迟创建和 Fabric 开关。脚本校验完整源码清单与哈希，输出各工具原始报告；编译器没有产生的分支计数标为 N/A。JaCoCo 0.8.13 从官方 Maven 获取并核对固定 SHA256，可通过 `JACOCO_HOME` 复用同版本已校验缓存。宿主行为覆盖与真实 SDK 编译分别执行。

## 交付配置与检查

共享 CI、发布配置和检查工具由 `github-delivery` 的模板与工具维护。Unif 组织值由 `code-delivery` 的 `assets/organization.json` 维护，接入时落实为本库 `.github/organization.json`，记录组织、包名规则、Pages 地址、发布 App 身份及远端设置。工具运行时读取项目文件，不依赖其他技能的安装目录；适用技能按当前任务独立选择。

在仓库根目录按阶段执行：

| 命令 | 检查范围 |
| --- | --- |
| `node .github/scripts/check-delivery.cjs` | 离线检查受管文件、组织配置与 source 元数据。 |
| `node .github/scripts/check-library.cjs pack` | 完成库构建后，检查当前 tarball 的导出、声明与文件清单。 |
| `node .github/scripts/check-library.cjs release` | 发行前校验 README、许可和发布配置，不执行发布。 |
| `node .github/scripts/check-library.cjs published` | 联网核验 npm 当前版本的元数据、下载完整性与实际 tarball。 |

CI 与发布步骤见本库 `.github/workflows/`，组织配置调整以项目文件及当前授权为准。本地检查、远端 CI、npm 发布、文档部署和设备验收分别报告。
