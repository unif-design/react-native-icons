---
title: 安装与使用
---

# 安装与使用

`@unif/react-native-icons` 是独立 SVG 图标包，不依赖 Design。发布版本可按下列方式安装；仓库当前源码的发布状态见交付记录。

```sh
yarn add @unif/react-native-icons react-native-svg
```

宿主需要接入 `react-native-svg`。裸 RN iOS 首次安装原生依赖后，在含 `Gemfile` 的应用目录执行 `bundle install`，再执行 `bundle exec pod install --project-directory=ios` 并重建应用。后续更新原生依赖时也需重新执行 pod install。Expo 项目使用 `npx expo install react-native-svg` 选择宿主兼容版本。

```tsx
import { SendOutlined, StarFilled } from '@unif/react-native-icons';

<SendOutlined size={20} color="#1677ff" />
<StarFilled size={24} color="#faad14" />
```

需要明确限定导入模块时，使用正式子路径：

```tsx
import SendOutlined from '@unif/react-native-icons/SendOutlined';
```

发布包含编译后的 JS 和类型。使用已有图标无需运行生成脚本，也无需配置 SVG transformer。命名导入的最终包体积取决于构建器；子路径组件自身不会引入全量图标目录。

首批基线为 React 19.2.3、React Native 0.86.3、react-native-svg 15.15.5；其他版本不因纯 JS 实现而自动视为已验证。Web 使用 react-native-web 和 react-native-svg 的 Web 实现；完整实例见本站。
