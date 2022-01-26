import { App, inject, InjectionKey } from 'vue'
import { createPinia } from 'pinia'

export interface Plugin {
  install(app: App): void
}

const components = import.meta.globEager('./components/**/*.vue')

export const tresjsSymbol: InjectionKey<Plugin> = Symbol('tresjs')

export function useTres(): Plugin {
  const tresjs = inject(tresjsSymbol)
  if (!tresjs) throw new Error('No tresjs provided!!!')

  return tresjs
}

const TresJSPlugin = {
  install(app: App) {
    app.provide(tresjsSymbol, TresJSPlugin)

    app.use(createPinia())
    Object.entries(components).forEach(([path, definition]) => {
      const componentName =
        path
          .split('/')
          .pop()
          ?.replace(/\.\w+$/, '') || ''

      /*      const componentName = path.replace(/^\.\/components\//, '').replace(/\.vue$/, '')
        const componentName = path || ''
          .split('/')
          .pop()
          .replace(/\.\w+$/, '') */

      app.component(componentName, definition.default)
    })
    Object.defineProperty(app, '__VUE_DYNAMIC_FORMS_SYMBOL__', {
      get() {
        return tresjsSymbol
      },
    })
  },
}

export default TresJSPlugin
