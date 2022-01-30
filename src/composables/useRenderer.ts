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
import useGL from '/@/store/basegl'

export interface RendererConfig extends WebGLRendererParameters {
  canvas?: HTMLCanvasElement
  orbitControls?: boolean
  shadows?: boolean | ShadowMapType
  resize?: boolean | string
  size?: number[] | { width: number; height: number }
  context?: any
}

const rendererConfig = reactive<RendererConfig>({
  canvas: undefined,
  orbitControls: false,
  antialias: true,
  alpha: false,
  resize: false,
  shadows: false,
  size: [800, 600],
})

const instance: Ref<string> = ref(uuidv4())
const { gl, addInstance } = useGL()

export function useRenderer(config: RendererConfig, instanceId?: string) {
  const { logError } = useLogger()
  const ctx = getCurrentInstance()
  if (instanceId) instance.value = instanceId

  addInstance(instance.value, {
    renderer: null,
    camera: null,
    scene: null,
    controls: null,
  })
  const currentInstance = computed(
    () => gl.instances[instanceId || instance.value],
  )

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
    if (currentInstance.value.renderer && value !== undefined) {
      if (isBoolean(value)) {
        currentInstance.value.renderer.shadowMap.enabled = value as boolean
      } else {
        currentInstance.value.renderer.shadowMap.enabled = true
        currentInstance.value.renderer.shadowMap.type = value as ShadowMapType
      }
    }
    /*    if (!currentInstance.value.renderer) {
      return
    }
    currentInstance.value.renderer.shadowMap.enabled = value */
    /* if (currentInstance.value.renderer) {
      if (isBoolean(value)) {
        currentInstance.value.renderer.shadowMap.enabled = value
      } else {
        currentInstance.value.renderer.shadowMap.enabled = value
        currentInstance.value.renderer.shadowMap.type = value
      }
    } */
  }

  function toggleResize(value: boolean | string) {
    if (currentInstance.value) {
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
      currentInstance.value.renderer?.setSize(
        resizeWidth || 800,
        resizeHeight || 600,
      )
      currentInstance.value.renderer?.setPixelRatio(
        Math.min(window.devicePixelRatio, 2),
      )
      if (currentInstance.value.camera && aspect) {
        ;(currentInstance.value.camera as PerspectiveCamera).aspect = aspect
        currentInstance.value.camera?.updateProjectionMatrix()
      }
    }
  }

  function toggleOrbitControls(value: boolean) {
    if (currentInstance.value) {
      if (
        value &&
        currentInstance.value.camera &&
        currentInstance.value.renderer
      ) {
        currentInstance.value.controls = new OrbitControls(
          currentInstance.value.camera,
          currentInstance.value.renderer.domElement,
        )
        currentInstance.value.controls.enableDamping = true
      } else {
        if (currentInstance.value.controls) {
          currentInstance.value.controls.enabled = false
        }
      }
    }
  }

  function updateControls() {
    if (currentInstance.value.controls) {
      currentInstance.value.controls.update()
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

      currentInstance.value.renderer = renderer
      initRenderer()

      ctx?.emit('created')
    } catch (error) {
      logError(error as string)
      return null
    }
  }

  function initRenderer() {
    toggleShadows(rendererConfig.shadows)

    if (rendererConfig.orbitControls && currentInstance.value) {
      toggleOrbitControls(rendererConfig.orbitControls)
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
    if (!currentInstance.value.renderer) {
      logError('Renderer not created')
      return
    }
    if (!currentInstance.value.scene) {
      logError(
        'No scene provided - Please add a <scene> element to your template or use the `useScene`',
      )
      return
    }
    if (!currentInstance.value.camera) {
      logError(
        'No camera provided - Please add a <camera> element to your template or use the `useCamera`',
      )
      return
    }
    currentInstance.value.renderer.render(
      toRaw(currentInstance.value.scene) as Scene,
      currentInstance.value.camera as Camera,
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
    gl: currentInstance.value,
  }
}
