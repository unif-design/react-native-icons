# 开发资料

设计依据见 [独立图标包设计](superpowers/specs/2026-10-11-icons-design.md)，实施记录见 [计划](superpowers/plans/2026-10-11-icons.md)。

保持官方 CLI 生成的工程结构，在其基础上实现图标、示例和必要接线。源 SVG 位于 src/svg，公开名称由 scripts/icon-manifest.json 明确指定，生成文件位于 src/icons 与 src/index.tsx。维护后运行 yarn generate；业务消费者不执行生成脚本。

首批资源及严格 SVG 校验器源自 react-native-design 4d0ac8743b6e4d49547b2890c51b2dec04423337（MIT），保留原始几何及绘制属性。新库独立后在这里维护资源；Design 消费切换须随新包发布另行交付。

## CI 标准

标准仓 unif-design/.github，采用 main 提交 d91483b7bb09a4d924a592ea434f2a588cc26caa；执行 scripts/sync-repo.sh react-native-icons <本仓绝对路径>。受管 CI 文件不单仓修改。保持 .nvmrc、Yarn、Turbo、example build 及 release-it 的真实接线。官方 CLI 本次 --tools 数组选项仅采用 eslint，Jest、lefthook、release-it 的实际配置已在工程接入时补齐。

本仓尚不在组织 Agent 与 llms 同步脚本的五仓名单中；AGENTS.md 为本库入口，website/scripts/llms 和公共 builder 测试原样来自同一模板修订。正式扩展自动同步应修改标准仓白名单。

## 验证

库开发、Community CLI example 和 Website 统一采用 React 19.3.0／RN 0.88.0；CLI 20.2.0 与原生 example 按官方 `@react-native-community/template@0.88.0` 同步。Yarn 在根目录提升同版本依赖，保证库与 example 使用同一 React 实例。iOS 采用 SceneDelegate 启动 React，Android 采用 SDK 37、Kotlin 2.2.0、Gradle 9.4.1 及模板的 AGP 9 兼容开关。

SVG 使用 `15.16.0` 的正式 RN 0.87+ 资源解析修复；Website 按上游 Webpack 说明显式安装 `@react-native/assets-registry@0.88.0`，配合 RN Web 0.21.4 [正式公开的 AssetRegistry](https://github.com/necolas/react-native-web/releases/tag/0.21.4)；该兼容包的混合模块格式由 Babel 转换，共享 Web 消费者的资产注册表。

Jest 覆盖所有 `src/**/*.{ts,tsx}`（包含生成图标和保留的 CLI 示例）及 `example/src/**/*.{ts,tsx}`，四项覆盖率门禁均为 100%。生成器、SVG 解析器、打包验证器与文档工具使用各自测试，不并入运行时覆盖率。两端原生 example 仅保留官方模板宿主，没有本库自有原生模块；宿主构建与真机展示须单独验证。

生成与源资源一致性、组件属性/颜色/图形、类型、打包消费、Metro bundle、网站构建和 CI 静态检查分别验证。iOS/Android 原生编译、设备、远端 CI 及 npm 发布不能互相替代。

## 官网样式

首页直接消费 `@unif/react-native-design@0.40.4/docs-home.css`，仅作为 website 开发依赖。官网只导入该 CSS 出口，不导入 Design 的 JS 组件或主题；图标库自身的运行时与 peer 依赖不变。CSS 包仍声明完整 Design 的原生 peers，安装会显示这些未使用 peers 的提示；不要为仅消费样式而安装原生 UI 依赖。

### 原生宿主与构建工具

iOS example 使用 Ruby 3.3+，`example/Gemfile.lock` 固定 CocoaPods 1.17.0、ActiveSupport 7.2.4 与 xcodeproj 1.28.1；在 `example/` 执行 `bundle install`，再到 `example/ios/` 执行 `bundle exec pod install --deployment`。提交的 Podfile.lock 与实际 RN 0.88 构建一致。该组合已通过真实 iOS 设备 SDK 的无签名 Debug 编译；Android example 的 `:app:assembleDebug -PreactNativeArchitectures=arm64-v8a` 已通过。设备安装、交互和远端 CI 另行验收。

`yarn test:native` 直接插桩 example 的两个 Kotlin 文件以及 AppDelegate／SceneDelegate 原始 Swift 文件，分别执行 Swift Debug 和 Release。测试替换外部 RN／UIKit 接口，断言宿主启动、依赖与窗口接线、场景筛选、链接转发及资源查找；Android 断言宿主延迟创建和 Fabric 开关。脚本校验完整源码清单与哈希，输出各工具原始报告；编译器没有产生的分支计数标为 N/A。JaCoCo 0.8.13 从官方 Maven 获取并核对固定 SHA256，可通过 `JACOCO_HOME` 复用同版本已校验缓存。宿主行为覆盖与真实 SDK 编译分别执行。
