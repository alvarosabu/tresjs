import {
  WebGLRendererParameters,
  ShadowMapType,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Camera,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  reactive,
  watch,
  toRaw,
  computed,
  getCurrentInstance,
  ref,
  Ref,
} from 'vue'
import { isBoolean, useWindowSize } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'

import { useLogger } from './useLogger'
import useGL from './useGL'

export interface RendererConfig extends WebGLRendererParameters {
  canvas?: HTMLCanvasElement
  orbitControls?: boolean
  shadows?: boolean | ShadowMapType
  resize?: boolean | string
  size?: number[] | { width: number; height: number }
  context?: any
  physicallyCorrectLights: boolean
}

const rendererConfig = reactive<RendererConfig>({
  canvas: undefined,
  orbitControls: false,
  antialias: true,
  alpha: false,
  resize: false,
  shadows: false,
  size: [800, 600],
  physicallyCorrectLights: false,
})

const instance: Ref<string> = ref(uuidv4())

export function useRenderer(config: RendererConfig, instanceId?: string) {
  const { logError } = useLogger()
  const ctx = getCurrentInstance()
  if (instanceId) instance.value = instanceId
  const { gl, addInstance, currentGL } = useGL(instanceId)

  addInstance(instance.value, {
    renderer: null,
    camera: null,
    scene: null,
    controls: null,
  })

  const { width, height } = useWindowSize()
  const aspectRatio = computed(() => width.value / height.value)

  watch(aspectRatio, updateRenderer)

  // TODO: investigate why toggling shadowMaps doesnt work.
  /* watch(
    () => rendererConfig.shadows,
    value => {
      toggleShadows(value)
    },
  ) */

  watch(
    () => rendererConfig.orbitControls,
    value => {
      if (value) {
        toggleOrbitControls(value)
      }
    },
  )

  watch(
    () => rendererConfig.resize,
    value => {
      if (value) {
        toggleResize(value)
      }
    },
  )

  Object.assign(rendererConfig, config)

  function updateConfig(config: RendererConfig) {
    Object.assign(rendererConfig, config)
  }

  function toggleShadows(value?: boolean | ShadowMapType | undefined) {
    if (currentGL.value.renderer && value !== undefined) {
      if (isBoolean(value)) {
        currentGL.value.renderer.shadowMap.enabled = value as boolean
      } else {
        currentGL.value.renderer.shadowMap.enabled = true
        currentGL.value.renderer.shadowMap.type = value as ShadowMapType
      }
    }
  }

  function toggleResize(value: boolean | string) {
    if (currentGL.value) {
      const parent = rendererConfig?.canvas?.parentNode
      let resizeWidth
      let resizeHeight
      let aspect
      if (isBoolean(value) && parent) {
        if (value) {
          const { clientWidth, clientHeight } = parent as HTMLElement
          resizeWidth = clientWidth
          resizeHeight = clientHeight
          aspect = resizeWidth / resizeHeight
        }
      } else if (value === 'window') {
        resizeWidth = width.value
        resizeHeight = height.value
        aspect = aspectRatio.value
      }
      currentGL.value.renderer?.setSize(resizeWidth || 800, resizeHeight || 600)
      currentGL.value.renderer?.setPixelRatio(
        Math.min(window.devicePixelRatio, 2),
      )
      if (currentGL.value.camera && aspect) {
        ;(currentGL.value.camera as PerspectiveCamera).aspect = aspect
        currentGL.value.camera?.updateProjectionMatrix()
      }
    }
  }

  function toggleOrbitControls(value: boolean) {
    if (currentGL.value) {
      if (value && currentGL.value.camera && currentGL.value.renderer) {
        currentGL.value.controls = new OrbitControls(
          currentGL.value.camera,
          currentGL.value.renderer.domElement,
        )
        currentGL.value.controls.enableDamping = true
      } else {
        if (currentGL.value.controls) {
          currentGL.value.controls.enabled = false
        }
      }
    }
  }

  function updateControls() {
    if (currentGL.value.controls) {
      currentGL.value.controls.update()
    }
  }

  function createRenderer(
    canvas: HTMLCanvasElement,
    context?: any,
  ): void | null {
    const setup: Partial<RendererConfig> = {
      canvas,
      antialias: rendererConfig.antialias,
      alpha: rendererConfig.alpha,
    }
    if (instance.value) canvas.setAttribute('id', instance.value)
    rendererConfig.canvas = canvas

    if (context) {
      setup.context = context
    }

    try {
      const renderer = new WebGLRenderer(setup)

      currentGL.value.renderer = renderer
      initRenderer()

      ctx?.emit('created')
    } catch (error) {
      logError(error as string)
      return null
    }
  }

  function initRenderer() {
    if (currentGL.value) {
      toggleShadows(rendererConfig.shadows)
      if (rendererConfig.orbitControls) {
        toggleOrbitControls(rendererConfig.orbitControls)
      }
      if (currentGL.value.renderer)
        currentGL.value.renderer.physicallyCorrectLights =
          rendererConfig.physicallyCorrectLights
    }

    render()
    loop()
    updateRenderer()
  }

  function updateRenderer() {
    if (rendererConfig.resize) {
      toggleResize(rendererConfig.resize)
    }
  }

  function render() {
    if (!currentGL.value.renderer) {
      logError('Renderer not created')
      return
    }
    if (!currentGL.value.scene) {
      logError(
        'No scene provided - Please add a <scene> element to your template or use the `useScene`',
      )
      return
    }
    if (!currentGL.value.camera) {
      logError(
        'No camera provided - Please add a <camera> element to your template or use the `useCamera`',
      )
      return
    }
    currentGL.value.renderer.render(
      toRaw(currentGL.value.scene) as Scene,
      currentGL.value.camera as Camera,
    )
  }

  const loop = () => {
    render()

    if (rendererConfig.orbitControls) {
      updateControls()
    }
    requestAnimationFrame(loop)
  }

  return {
    createRenderer,
    updateConfig,
    initRenderer,
    gl: currentGL.value,
  }
}
