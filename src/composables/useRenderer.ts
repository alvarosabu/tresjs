import { WebGLRendererParameters, ShadowMapType, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { reactive, watch, toRaw, computed } from 'vue'
import gl from '/@/store/basegl'
import { isBoolean, useWindowSize } from '@vueuse/core'

import { useLogger } from './useLogger'

export interface RendererConfig extends WebGLRendererParameters {
  orbitControls?: boolean | OrbitControls
  shadows?: boolean | ShadowMapType
  resize?: boolean | string
  size?: number[] | { width: number; height: number }
  context?: any
}

const rendererConfig = reactive<RendererConfig>({
  orbitControls: false,
  antialias: true,
  alpha: false,
  resize: false,
  shadows: false,
  size: [800, 600],
})

export function useRenderer(config: RendererConfig) {
  const { logError } = useLogger()

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
      toggleOrbitControls(value)
    },
  )

  Object.assign(rendererConfig, config)

  function updateConfig(config: RendererConfig) {
    Object.assign(rendererConfig, config)
  }

  function toggleShadows(value?: boolean | ShadowMapType) {
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

  function toggleOrbitControls(value: boolean | OrbitControls) {
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

    if (context) {
      setup.context = context
    }

    try {
      /*  gl.setRenderer(new WebGLRenderer(setup)) */
      gl.renderer = new WebGLRenderer(setup)
      initRenderer()

      return gl.renderer
      /* emit('created', gl.renderer) */
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
    gl.renderer.setSize(width.value, height.value)
    gl.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    gl.camera.aspect = aspectRatio.value
    gl.camera.updateProjectionMatrix()
  }

  function render() {
    if (!gl.renderer) {
      logError('Renderer not created')
      return
    }
    gl.renderer.render(toRaw(gl.scene), gl.camera)
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
