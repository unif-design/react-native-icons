---
title: 维护图标
---

<!-- Generated from @unif/react-native-icons; edit source documentation. -->

# 维护图标

1. 在 `src/svg` 添加 SVG，并在 `scripts/icon-manifest.json` 登记正式组件名称。
2. SVG 使用 `viewBox="0 0 24 24"`、根 `fill="none"`、`stroke="currentColor"`、`stroke-width="1.75"`、圆角端点与连接。直接叶子只允许 path、circle、rect，禁止脚本、外链、嵌套和固定颜色。
3. 实心图元使用 `fill="currentColor" stroke="none"`。只有整体实心图标采用 Filled，局部实心细节仍可属于 Outlined。
4. 运行 `yarn generate`，生成独立组件、公开出口和两个消费者的图标清单。`yarn prepare` 构建时也自动生成。
5. 在 `website/src/components/iconCategories.ts` 为新增图标登记用途分类。每个图标只属于一类；网站类型检查会提示遗漏的分类。
6. 运行 `yarn lint`、`yarn typecheck`、`yarn test --maxWorkers=2 --coverage`、`yarn prepare`、`yarn verify:package`、`yarn website typecheck` 与 `yarn website build`。

SVG 和名称也供鸿蒙图标库使用；修改后按[同源生成与跨仓校验](https://github.com/unif-design/react-native-icons/blob/main/docs/DEVELOPMENT.md#同源生成与跨仓校验)核对两个目标，只在已授权的目标仓生成。

生成器先完整校验所有输入；存在非法 SVG、名称冲突或清单不一致时不写生成文件。`yarn check:icons` 只读检查已生成文件是否一致。不要手改自动生成的组件或消费者清单。

原生示例使用官方 Community CLI：`yarn example ios`、`yarn example android`。CI、版本、发布和文档部署来自组织 `.github` 模板。远端首次接入还需 release bot、分支检查和 npm Trusted Publisher 配置；本地构建通过不表示包已发布。
