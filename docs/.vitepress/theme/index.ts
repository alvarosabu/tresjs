import DefaultTheme from 'vitepress/theme'
import { TresJSPlugin } from '../../../dist/tres.es'

const theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(TresJSPlugin)
  },
}

export default theme
