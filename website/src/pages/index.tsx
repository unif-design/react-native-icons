import { useState } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  ArrowRightOutlined,
  CameraOutlined,
  CheckOutlined,
  CopyOutlined,
  GridOutlined,
  HeartOutlined,
  ImageOutlined,
  SearchOutlined,
  SendOutlined,
  SettingsOutlined,
  StarFilled,
  UserOutlined,
} from '@unif/react-native-icons';
import '@unif/react-native-design/docs-home.css';
import IconCatalog from '../components/IconCatalog';
import { iconCatalog } from '../components/catalog';

const PREVIEW = [
  CameraOutlined,
  ImageOutlined,
  SearchOutlined,
  SendOutlined,
  HeartOutlined,
  StarFilled,
  UserOutlined,
  SettingsOutlined,
];
const INSTALL = 'npm install @unif/react-native-icons react-native-svg';

function InstallBlock() {
  const [message, setMessage] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setMessage('安装命令已复制');
    } catch {
      setMessage(INSTALL);
    }
  }
  return (
    <>
      <div className="hp-install">
        <span className="dollar" aria-hidden>
          $
        </span>
        <code>
          npm install <span className="pkg">@unif/react-native-icons</span>{' '}
          react-native-svg
        </code>
        <button
          className="hp-install-copy"
          type="button"
          aria-label="复制安装命令"
          onClick={copy}
        >
          {message === '安装命令已复制' ? (
            <CheckOutlined size={16} color="currentColor" />
          ) : (
            <CopyOutlined size={16} color="currentColor" />
          )}
        </button>
      </div>
      <span className="icons-install-feedback" role="status">
        {message}
      </span>
    </>
  );
}

export default function Home() {
  return (
    <Layout
      title="Unif Icons — React Native 图标组件"
      description="Unif React Native SVG 图标，按名称查找并复制组件代码。"
    >
      <main className="unif-home icons-home">
        <section className="hp-hero">
          <div className="hp-hero-split icons-hero-split">
            <div className="hp-hero-copy">
              <span className="hp-eyebrow">@unif/react-native-icons</span>
              <h1 className="hp-title">
                统一的图形语言，
                <br />
                <span className="accent">直接使用的图标组件</span>
              </h1>
              <p className="hp-tagline">
                为应用里的操作、状态和内容提供清晰表达。选择一个图标，作为 React
                组件放进界面。
              </p>
              <div className="hp-cta-row">
                <Link
                  to="/docs/getting-started"
                  className="hp-btn hp-btn-primary"
                >
                  开始使用{' '}
                  <span className="hp-arrow">
                    <ArrowRightOutlined size={18} color="currentColor" />
                  </span>
                </Link>
                <Link to="/#icons" className="hp-btn hp-btn-outline">
                  浏览全部图标
                </Link>
              </div>
              <InstallBlock />
              <div className="hp-meta-row">
                <span className="hp-chip">
                  <span className="dot" />
                  {iconCatalog.length} 个图标
                </span>
                <span className="hp-chip">Outlined / Filled</span>
                <span className="hp-chip">TypeScript</span>
              </div>
            </div>
            <div className="icons-showcase">
              <div className="hp-code compact">
                <div className="hp-code-bar">
                  <span className="hp-code-dots" aria-hidden>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="hp-code-file">App.tsx</span>
                  <span className="hp-code-tag">SVG</span>
                </div>
                <div className="hp-code-body">
                  <pre>
                    <code>
                      <span className="hp-cl">
                        <span className="ln" aria-hidden>
                          1
                        </span>
                        <span className="tok-kw">import</span>{' '}
                        {'{ SendOutlined }'}
                      </span>
                      <span className="hp-cl">
                        <span className="ln" aria-hidden>
                          2
                        </span>{' '}
                        <span className="tok-kw">from</span>{' '}
                        <span className="tok-str">
                          '@unif/react-native-icons'
                        </span>
                        ;
                      </span>
                      <span className="hp-cl">
                        <span className="ln" aria-hidden>
                          3
                        </span>{' '}
                      </span>
                      <span className="hp-cl hl">
                        <span className="ln" aria-hidden>
                          4
                        </span>
                        <span className="tok-fn">{'<SendOutlined'}</span>
                      </span>
                      <span className="hp-cl">
                        <span className="ln" aria-hidden>
                          5
                        </span>
                        {'  size={24} color='}
                        <span className="tok-str">"#EB6E00"</span>
                      </span>
                      <span className="hp-cl">
                        <span className="ln" aria-hidden>
                          6
                        </span>
                        <span className="tok-fn">{'/>'}</span>
                      </span>
                    </code>
                  </pre>
                </div>
              </div>
              <div className="icons-preview" aria-label="图标组件预览">
                <div className="icons-preview-heading">
                  <span>一套风格，丰富表达</span>
                  <span>24 × 24</span>
                </div>
                <div className="icons-preview-grid">
                  {PREVIEW.map((Icon, index) => (
                    <span key={index}>
                      <Icon size={30} color="currentColor" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="hp-features">
          <div className="hp-sec-label">核心能力</div>
          <div className="hp-feature-grid icons-feature-grid">
            <div className="hp-feature">
              <div className="hp-feat-icon">
                <GridOutlined size={24} color="currentColor" />
              </div>
              <h2 className="hp-feat-title">一致的视觉风格</h2>
              <p className="hp-feat-desc">
                统一画布、描边与圆角，覆盖常见操作和状态。
              </p>
            </div>
            <div className="hp-feature">
              <div className="hp-feat-icon">
                <SendOutlined size={24} color="currentColor" />
              </div>
              <h2 className="hp-feat-title">直接使用组件</h2>
              <p className="hp-feat-desc">
                按名称导入，调整尺寸、颜色与描边即可使用。
              </p>
            </div>
            <div className="hp-feature">
              <div className="hp-feat-icon">
                <CheckOutlined size={24} color="currentColor" />
              </div>
              <h2 className="hp-feat-title">独立接入</h2>
              <p className="hp-feat-desc">
                支持单图标入口，自带类型，无需安装完整 Design 组件库。
              </p>
            </div>
          </div>
        </section>
        <section className="icons-directory">
          <div className="hp-sec-label">图标目录</div>
          <Heading as="h2" id="icons">
            找到界面需要的图标
          </Heading>
          <p className="icons-intro">按名称搜索，点击图标复制组件代码。</p>
          <IconCatalog />
        </section>
      </main>
    </Layout>
  );
}
