# @unif/react-native-icons

Unif React Native SVG 图标组件。独立于 Design，使用命名组件，不需要消费者处理 SVG 或运行生成脚本。

```tsx
import { SendOutlined, CameraOutlined, StarFilled } from '@unif/react-native-icons';

<SendOutlined size={20} color="#1677ff" />
<CameraOutlined size={24} color="#333" strokeWidth={1.75} />
<StarFilled size={24} color="#faad14" />
```

发布包可使用 `yarn add @unif/react-native-icons react-native-svg` 安装。当前本地实现与 npm 发布状态分别记录，不能把仓库存在视为已发布。

若宿主尚未接入 `react-native-svg`，裸 RN iOS 需执行 CocoaPods 安装并重建；Expo 使用 `npx expo install react-native-svg`。图标包没有自写原生模块，原生 SVG 绘制由该 peer 提供。

## 导出与属性

默认尺寸 24、颜色 `#000`、描边宽度 1.75；尺寸不做隐式缩放，颜色不依赖主题 Provider。组件接受 `IconProps`、SVG 样式、testID、无障碍属性和 Svg ref。图标默认是装饰件；按钮的操作语义由父级提供。

```tsx
import SendOutlined from '@unif/react-native-icons/SendOutlined';
import type { IconProps } from '@unif/react-native-icons';
```

根入口提供命名导出，单图标子路径仅引用自身图形与共享渲染器。最终应用包体积仍取决于构建器与使用方式。

首批包含 131 个图标：129 个 Outlined、StarFilled 和 StopFilled。只有整体实心的图形使用 Filled；局部实心细节不改变描边图标命名。没有 Icon/Out 别名或虚构的双色变体。

支持基线：React 19.2.3、React Native 0.86.3、react-native-svg 15.15.5。示例与文档站分别覆盖原生接线与 RN Web；设备呈现需单独验收。

## 本地开发

```sh
yarn install --immutable
yarn generate
yarn lint
yarn typecheck
yarn test --maxWorkers=2 --coverage
yarn prepare
yarn verify:package
yarn example ios
yarn example android
yarn website start
```

维护 SVG 与名称映射后，生成器统一生成组件和消费者清单；`yarn prepare` 自动包含生成步骤。`yarn check:icons` 只读检查一致性。打包校验从 tarball 解析正式 JS/类型出口，并用已有 peer 验证消费，不声称完成独立的 npm 安装或真机验收。

官方 `create-react-native-library` 工程结构保留。CI 来自 `unif-design/.github` 模板，详见 [开发资料](docs/DEVELOPMENT.md)。远端分支检查、release bot、npm Trusted Publisher 与发布在正式交付时分别核对。

资源和严格 SVG 校验器首批来自 `@unif/react-native-design`，遵循 MIT。库消费迁移在发布后单独接入。
