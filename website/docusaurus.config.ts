import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import pkg from '../package.json';

const config: Config = {
  title: 'Unif Icons',
  tagline: '统一风格、直接使用的 React Native SVG 图标组件',
  favicon: 'img/logo.png',
  trailingSlash: false,
  url: 'https://unif-design.github.io',
  baseUrl: '/react-native-icons/',
  organizationName: 'unif-design',
  projectName: 'react-native-icons',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'throw' } },
  i18n: { defaultLocale: 'zh-Hans', locales: ['zh-Hans'] },
  presets: [
    [
      'classic',
      {
        docs: { routeBasePath: 'docs', sidebarPath: './sidebars.ts' },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],
  plugins: ['./src/plugins/rnw.cjs'],
  themeConfig: {
    image: 'img/logo.png',
    colorMode: { defaultMode: 'light', respectPrefersColorScheme: true },
    navbar: {
      title: 'Unif Icons',
      logo: { alt: 'Unif', src: 'img/logo.png' },
      items: [
        { to: '/#icons', label: '图标目录', position: 'left' },
        {
          type: 'docSidebar',
          sidebarId: 'guide',
          label: '文档',
          position: 'left',
        },
        {
          type: 'html',
          position: 'right',
          value: `<span class="navbar-version">v${pkg.version.split('.').slice(0, 2).join('.')}</span>`,
        },
        {
          href: 'https://github.com/unif-design/react-native-icons',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: '文档',
          items: [
            { label: '快速开始', to: '/docs/getting-started' },
            { label: '组件 API', to: '/docs/api' },
            { label: '维护图标', to: '/docs/contributing' },
          ],
        },
        {
          title: '资源',
          items: [
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@unif/react-native-icons',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/unif-design/react-native-icons',
            },
          ],
        },
        {
          title: 'Unif 生态',
          items: [
            { label: '文档总站', href: 'https://unif.design' },
            {
              label: 'Design',
              href: 'https://unif-design.github.io/react-native-design/',
            },
            {
              label: 'Camera',
              href: 'https://unif-design.github.io/react-native-camera/',
            },
            {
              label: 'Chat',
              href: 'https://unif-design.github.io/react-native-chat/',
            },
          ],
        },
      ],
      copyright: '@unif/react-native-icons · MIT',
    },
  } satisfies Preset.ThemeConfig,
};
export default config;
