import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Unif Icons',
  tagline: '直接使用的 React Native SVG 图标组件',
  url: 'https://unif-design.github.io',
  baseUrl: '/react-native-icons/',
  organizationName: 'unif-design',
  projectName: 'react-native-icons',
  onBrokenLinks: 'throw',
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
    colorMode: { respectPrefersColorScheme: true },
    navbar: {
      title: 'Unif Icons',
      items: [
        { to: '/', label: '图标目录', position: 'left' },
        { to: '/docs/getting-started', label: '使用指南', position: 'left' },
        {
          href: 'https://github.com/unif-design/react-native-icons',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: { style: 'light', copyright: '@unif/react-native-icons · MIT' },
  } satisfies Preset.ThemeConfig,
};
export default config;
