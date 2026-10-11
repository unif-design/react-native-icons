# 独立图标包设计

依据：本对话已确认独立包、风格后缀命名、官方 JavaScript library 脚手架及组织 CI 模板；用户于 2026-10-11 授权开始实现。

## 范围

在现有空仓库实现 `@unif/react-native-icons`。首批承接 Design 当前 131 个 SVG，保持路径、描边、实心细节与透明度。此次只修改新库；Design、Chat、Camera 的版本接入在新包发布后另行交付。

## 公共契约

- 图标按语义名称加风格后缀导出：`SendOutlined`、`StarOutlined`、`StarFilled`、`StopFilled`；不增加 Icon/Out 别名或不存在的 TwoTone 变体。
- 包根提供命名导出，`@unif/react-native-icons/SendOutlined` 提供同名组件的独立入口；根入口不导出运行时全量名称注册表。
- 组件默认 `size=24`、`color='#000'`、`strokeWidth=1.75`，尺寸不做隐式缩放。消费者可传 SVG 样式、测试标识、无障碍属性与 ref。装饰图标默认 `accessible=false`，独立语义由消费者显式提供。
- 图标不读取 Design 主题，不持有业务状态、动作或平台资源。peer 为 React、React Native、react-native-svg，范围仅声明本次选定基线。
- SVG 源为库内部维护资源，构建自动校验并生成单图标模块及类型。消费者安装产物后直接引用组件，无生成器或 SVG transformer 要求。

## 工程

使用 create-react-native-library 0.63.1、Community CLI example（RN 0.86.3 / React 19.2.3）、Yarn 4.11.0 与 Bob。文档采用 Docusaurus，以真实公开组件呈现图标目录。SVG 校验沿用 Design 已有严格解析器，不放宽原规范。

组织标准源：`unif-design/.github` main，提交 `d91483b7bb09a4d924a592ea434f2a588cc26caa`。使用该修订的 `scripts/sync-repo.sh` 下发 CI、release、PR、setup、changes 与文档部署模板，不自行改写受管 workflow。新库不在 Agent/llms 同步脚本的五仓名单中，因此本地登记开发入口，并原样采用 llms 公共实现，记录来源。

## 验收边界

验证非法 SVG 拒绝与失败不覆写、命名及输出一致性、描边/填充/透明度、属性与 ref、类型和子路径导出、打包内容、单图标消费的依赖图、示例与网站真实公开入口。执行本地 lint、类型、Jest、生成检查、Bob、打包消费、Metro bundle、网站构建、actionlint；原生编译与真机分别记录。

此次不提交、推送、发布或修改 GitHub 远端设置；CI 模板落盘不表示远端 CI、release bot 或 npm Trusted Publisher 已验证。
