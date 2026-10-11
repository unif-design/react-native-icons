---
title: 组件 API
---

# 组件 API

每个图标是独立组件，名称采用 PascalCase 加实际风格后缀：描边 `Outlined`、实心 `Filled`。不存在的风格不提供占位变体，也不增加 `Icon` 或 `Out` 别名。

| 参数        | 类型                 | 默认值 | 说明                                 |
| ----------- | -------------------- | ------ | ------------------------------------ |
| size        | number               | 24     | 宽高，使用 RN 逻辑像素，不做隐式缩放 |
| color       | ColorValue           | '#000' | 描边与实心图元颜色                   |
| strokeWidth | number               | 1.75   | 描边宽度，纯实心图元不受影响         |
| style       | SvgProps['style']    | —      | SVG 样式                             |
| testID      | string               | —      | SVG 测试标识                         |
| ref         | React.Ref&lt;Svg&gt; | —      | 转发到 react-native-svg 的 Svg 实例  |

其余 SVG 属性按 `IconProps` 透传；`children`、`width`、`height`、`viewBox`、`fill`、`stroke` 由图标契约管理。颜色由消费者提供，不隐式读取 Design ThemeProvider。玻璃背景由承载图标的按钮或容器负责。

图标默认 `accessible=false`。操作名称通常由父级按钮提供；独立表达语义时可显式设置：

```tsx
<StarFilled accessible accessibilityLabel="已收藏" color="#faad14" />
```

SVG 保持原始 path/circle/rect、实心细节和透明度。公开组件不创建业务动作、网络请求或全局状态。
