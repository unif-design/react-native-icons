# @unif/react-native-icons

React Native SVG 图标组件库，支持调整尺寸、颜色和描边，不依赖 Design。安装后按名称使用，无需处理 SVG 或运行生成脚本。

[图标目录](https://unif-design.github.io/react-native-icons/#icons) · [API](website/docs/api.md) · [原生示例](example/README.md) · [npm](https://www.npmjs.com/package/@unif/react-native-icons) · [MIT 许可证](LICENSE)

## 接入要求

| 依赖             | 支持范围         | 本仓原生开发组合 |
| ---------------- | ---------------- | ---------------- |
| React            | `>=19.2.3 <20`   | 19.3.0           |
| React Native     | `>=0.86.3 <0.89` | 0.88.0           |
| react-native-svg | `>=15.15.5 <16`  | 15.16.0          |

原生 SVG 绘制由 `react-native-svg` 提供；Web 使用其 Web 实现及 React Native Web。文档站的具体版本与兼容说明见[开发资料](docs/DEVELOPMENT.md#svg-web-版本与平台支持)，上述开发组合不代表全部版本组合已验证。

## 安装

```sh
npm install @unif/react-native-icons react-native-svg@^15.15.5
```

裸 RN 项目安装原生依赖后，iOS 需同步 Pods，两端重新构建。Expo 项目使用 `npx expo install react-native-svg` 选择宿主兼容版本；完整步骤见[安装与使用](website/docs/getting-started.md)。

## 使用图标

```tsx
import { SendOutlined } from '@unif/react-native-icons';

export function SendIcon() {
  return <SendOutlined size={20} color="#1677ff" />;
}
```

默认尺寸为 24、颜色为 `#000`、描边宽度为 1.75，不自动缩放或读取主题。图标默认为装饰件，按钮的操作名称由父级提供；独立表达语义时设置无障碍属性。

组件名采用 `Outlined`／`Filled` 风格后缀。也可从 `@unif/react-native-icons/SendOutlined` 导入单图标，详情见[导入方式](website/docs/getting-started.md)；最终包体积取决于构建器与使用方式。

## 更多用法

- [图标目录](https://unif-design.github.io/react-native-icons/#icons)：按名称或用途查找图标，复制组件代码。
- [组件 API](website/docs/api.md)：属性、SVG 透传、ref 和无障碍。
- [原生示例](example/README.md)：运行图标目录与搜索，检查设备呈现。
- [贡献指南](CONTRIBUTING.md)与[开发资料](docs/DEVELOPMENT.md)：维护 SVG、生成组件、跨平台校验及交付。

图标资源与 SVG 校验器使用 MIT 许可。
