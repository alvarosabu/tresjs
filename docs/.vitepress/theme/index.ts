import DefaultTheme from 'vitepress/theme'
import { TresJSPlugin } from '/@/plugin'

const theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(TresJSPlugin)
  },
}

export default theme
