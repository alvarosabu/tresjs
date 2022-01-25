import { App, inject, InjectionKey } from 'vue'

export interface Plugin {
  install(app: App): void
}

export const tresjsSymbol: InjectionKey<Plugin> = Symbol('tresjs')

export function useTres(): Plugin {
  const tresjs = inject(tresjsSymbol)
  if (!tresjs) throw new Error('No tresjs provided!!!')

  return tresjs
}

const TresJSPlugin = {
  install(app: App) {
    app.provide(tresjsSymbol, TresJSPlugin)

    console.log('Hola tresjs!!!')
    Object.defineProperty(app, '__VUE_DYNAMIC_FORMS_SYMBOL__', {
      get() {
        return tresjsSymbol
      },
    })
  },
}

export default TresJSPlugin
