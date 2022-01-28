import {
  WebGLRendererParameters,
  ShadowMapType,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Camera,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { reactive, watch, toRaw, computed, getCurrentInstance } from 'vue'
import gl from '/@/store/basegl'
import { isBoolean, useWindowSize } from '@vueuse/core'

import { useLogger } from './useLogger'

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

export function useRenderer(config: RendererConfig) {
  const { logError } = useLogger()
  const ctx = getCurrentInstance()

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
    if (gl.renderer && value !== undefined) {
      if (isBoolean(value)) {
        gl.renderer.shadowMap.enabled = value
      } else {
        gl.renderer.shadowMap.enabled = true
        gl.renderer.shadowMap.type = value
      }
    }
    /*    if (!gl.renderer) {
      return
    }
    gl.renderer.shadowMap.enabled = value */
    /* if (gl.renderer) {
      if (isBoolean(value)) {
        gl.renderer.shadowMap.enabled = value
      } else {
        gl.renderer.shadowMap.enabled = value
        gl.renderer.shadowMap.type = value
      }
    } */
  }

  function toggleResize(value: boolean | string) {
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
    gl.renderer?.setSize(resizeWidth || 800, resizeHeight || 600)
    gl.renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    if (gl.camera && aspect) {
      ;(gl.camera as PerspectiveCamera).aspect = aspect
      gl.camera?.updateProjectionMatrix()
    }
  }

  function toggleOrbitControls(value: boolean) {
    if (value && gl.camera && gl.renderer) {
      gl.controls = new OrbitControls(gl.camera, gl.renderer.domElement)
      gl.controls.enableDamping = true
    } else {
      if (gl.controls) {
        gl.controls.enabled = false
      }
    }
  }

  function updateControls() {
    if (gl.controls) {
      gl.controls.update()
    }
  }

  function createRenderer(
    canvas: HTMLCanvasElement,
    context?: any,
  ): WebGLRenderer | null {
    const setup: Partial<RendererConfig> = {
      canvas,
      antialias: rendererConfig.antialias,
      alpha: rendererConfig.alpha,
    }

    rendererConfig.canvas = canvas

    if (context) {
      setup.context = context
    }

    try {
      gl.renderer = new WebGLRenderer(setup)
      initRenderer()

      ctx?.emit('created', gl.renderer)
      return gl.renderer
    } catch (error) {
      logError(error as string)
      return null
    }
  }

  function initRenderer() {
    toggleShadows(rendererConfig.shadows)

    if (rendererConfig.orbitControls) {
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
    if (!gl.renderer) {
      logError('Renderer not created')
      return
    }
    if (!gl.scene) {
      logError(
        'No scene provided - Please add a <scene> element to your template or use the `useScene`',
      )
      return
    }
    if (!gl.camera) {
      logError(
        'No camera provided - Please add a <camera> element to your template or use the `useCamera`',
      )
      return
    }
    gl.renderer.render(toRaw(gl.scene) as Scene, gl.camera as Camera)
  }

  const loop = () => {
    render()

    if (rendererConfig.orbitControls) {
      updateControls()
    }
    requestAnimationFrame(loop)
  }

  return {
    gl,
    createRenderer,
    updateConfig,
    initRenderer,
  }
}
