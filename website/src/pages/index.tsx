import Layout from '@theme/Layout';
import IconCatalog from '../components/IconCatalog';

export default function Home() {
  return (
    <Layout
      title="图标目录"
      description="Unif React Native SVG 图标，按名称查找并复制组件代码。"
    >
      <main className="container icons-page">
        <p className="icons-eyebrow">UNIF · REACT NATIVE</p>
        <h1>图标，直接使用。</h1>
        <p className="icons-intro">
          统一的 24 × 24 图形，独立的 React 组件。搜索、选择，复制到你的界面。
        </p>
        <IconCatalog />
      </main>
    </Layout>
  );
}
