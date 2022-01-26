import { defineConfigWithTheme } from 'vitepress'
import theme from './theme'

export default defineConfigWithTheme({
  title: 'TresJS',
  description: 'A composable way of adding 3D to your Vue application',
  themeConfig: {
    repo: 'alvarosabu/tresjs',
    editLinks: true,
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated',
  },
  // ...
})
