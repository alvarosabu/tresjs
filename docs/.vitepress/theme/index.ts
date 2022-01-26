import DefaultTheme from 'vitepress/theme'
/* import TresJSPlugin from '/@' */

const theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    /* app.use(TresJSPlugin) */
  },
}

export default theme
