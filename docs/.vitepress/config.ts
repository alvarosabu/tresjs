import { defineConfigWithTheme } from 'vitepress'

export default defineConfigWithTheme({
  title: 'TresJS',
  description: 'A composable way of adding 3D to your Vue application',
  themeConfig: {
    repo: 'alvarosabu/tresjs',
    editLinks: true,
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated',
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          link: '/guide/',
        },
        {
          text: 'Core',
          link: '/guide/core/',
          children: [
            { text: 'Renderer', link: '/guide/core/renderer' },
            {
              text: 'Composables',
              link: '/guide/core/composables',
            },
          ],
        },
      ],
    },
  },
  // ...
})
