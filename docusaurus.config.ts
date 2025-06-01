import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'دليل طالب كلية الحاسبات',
  tagline: 'كل اللي تحتاجه كطالب في كلية الحاسبات',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://uqucc.sb.sa',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Saad5400', // Usually your GitHub org/user name.
  projectName: 'uqucc', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar'],
  },

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        docsRouteBasePath: '/',
        hashed: true,
        language: "ar",
      }),
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Saad5400/uqucc/tree/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Saad5400/uqucc/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: [
            './src/css/custom.css',
          ],
        },
        gtag: {
          trackingID: 'G-D6V76T469N',
          anonymizeIP: true,
        }
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'دليل طالب كلية الحاسبات',
      logo: {
        alt: 'كلية الحاسبات Logo',
        src: 'img/logo.svg',
      },
    },
    footer: {
      style: 'dark',
      copyright: `جميع الحقوق محفوظة © ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_SEARCH_API_KEY',
    //   indexName: 'YOUR_INDEX_NAME',
    //   contextualSearch: true,
    //   searchParameters: {},
    //   searchPagePath: 'search',
    //   insights: false,
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
