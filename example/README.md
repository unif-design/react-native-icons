# Icons 原生示例

使用本库公开组件展示图标目录，支持按组件名或 SVG 名称搜索，并跟随系统浅色／深色主题。应用入口为 [`src/App.tsx`](src/App.tsx)，图标清单由库生成器维护。

工程基于 React Native Community CLI；运行前准备 Android 或 iOS 开发环境。原生示例使用 React 19.3.0、RN 0.88.0 和 react-native-svg 15.16.0，依赖声明见 [package.json](package.json)。

## 安装与运行

在仓库根目录安装依赖并生成图标：

```sh
yarn install --immutable
yarn generate
yarn example start
```

保留 Metro 运行，在另一终端从仓库根目录执行 `yarn example android` 或 `yarn example ios`。

iOS 首次安装或更新原生依赖后，先在 `example/` 执行：

```sh
bundle install
bundle exec pod install --project-directory=ios
```

示例通过 workspace 消费当前库源码。修改 JS 后可由 Fast Refresh 更新；原生依赖和宿主配置变化后重新构建。无需修改 `src/catalog.ts`，新增图标的步骤见[维护图标](../CONTRIBUTING.md)。

## 检查

从仓库根目录执行：

```sh
yarn typecheck
yarn test --runInBand --runTestsByPath example/src/__tests__/App.test.tsx
yarn test:native
```

界面测试位于 `src/__tests__/`，原生宿主断言和边界替身位于 `android/__tests__/` 与 `ios/__tests__/`。`test:native` 的工具前置、输出与限制见[原生宿主验证](NATIVE_TESTS.md)。

运行应用时检查全部图标、搜索与空结果、浅色／深色和辅助功能。界面测试、原生宿主测试或一次编译均不能代替 iOS／Android 设备呈现；网站的 Web 图标也需单独检查。
