import {
  Camera,
  Scene,
  ShadowMapType,
  Vector2,
  WebGLRenderer,
  WebGLRendererParameters,
} from 'three'
import { computed, reactive, watch, toRaw, getCurrentInstance } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { isBoolean, useWindowSize } from '@vueuse/core'

import { useLogger } from './useLogger'

export type RendererSize = {
  width: number
  height: number
  wWidth: number
  wHeight: number
  ratio: number
}

export interface RendererConfig extends WebGLRendererParameters {
  orbitControls?: boolean | OrbitControls
  shadows?: boolean | ShadowMapType
  resize?: boolean | string
  size?: number[] | { width: number; height: number }
  context?: any
}

export interface RootStore {
  renderer: WebGLRenderer | null
  camera: Camera | null
  scene: Scene | null
  controls: OrbitControls | null
}

const state = reactive<RootStore>({
  renderer: null,
  camera: null,
  scene: null,
  controls: null,
})

export function useRenderer(config: RendererConfig) {
  const {
    antialias = true,
    alpha = false,
    orbitControls = false,
    resize = false,
    shadows = false,
    size = [800, 600],
  } = config

  const { width, height } = useWindowSize()
  const aspectRatio = computed(() => width.value / height.value)

  watch(aspectRatio, updateRenderer)
  watch(aspectRatio, updateCurrentCamera)

  const { logError } = useLogger()

  const { emit } = getCurrentInstance()

  /**
   * create WebGLRenderer
   */
  function createRenderer(
    canvas: HTMLCanvasElement,
    context?: any,
  ): WebGLRenderer | null {
    const setup: Partial<RendererConfig> = {
      canvas,
      antialias,
      alpha,
    }
    if (context) {
      setup.context = context
    }
    try {
      state.renderer = new WebGLRenderer(setup)
      emit('created', state.renderer)
    } catch (error) {
      logError(error as string)
      return null
    }

    if (shadows) {
      state.renderer.shadowMap.enabled = true
      if (!isBoolean(shadows)) {
        state.renderer.shadowMap.type = shadows as ShadowMapType
      }
    }

    initRenderer()
    return state.renderer
  }

  /**
   * init WebGLRenderer
   */
  function initRenderer() {
    if (!state.scene) {
      logError(
        'No scene provided - Please add a <scene> element to your template or use the `useScene`',
      )
      return
    }
    if (!state.camera) {
      logError(
        'No camera provided - Please add a <camera> element to your template or use the `useCamera`',
      )
      return
    }

    if (orbitControls) {
      initOrbitControls()
    }

    render()
    loop()
    updateRenderer()
    updateCurrentCamera()
  }

  /**
   * init OrbitControls
   */
  function initOrbitControls() {
    if (!state.controls && state.renderer && state.camera) {
      try {
        state.controls = new OrbitControls(
          state.camera,
          state.renderer.domElement,
        )
        state.controls.enableDamping = true
      } catch (error) {
        logError(error as string)
      }
    } else {
      logError(
        'Cannot initialize OrbitControls - Please check your WebGLRenderer and Camera',
      )
    }
  }

  /**
   * update OrbitControls
   */
  function updateOrbitControls() {
    if (!state.controls) {
      logError(
        'No controls provided - Please initialize the controls with `initOrbitControls`',
      )
      return
    }
    state.controls.update()
  }

  /**
   * update renderer
   */
  function updateRenderer() {
    if (!state.renderer) {
      logError(
        'No renderer provided - Please use CreateRenderer before using this hook',
      )
      return
    }

    if (resize) {
      state.renderer.setSize(width.value, height.value)
      state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    } else {
      if (Array.isArray(size)) {
        state.renderer.setSize(size[0], size[1])
      } else {
        state.renderer.setSize(size.width, size.height)
      }
    }

    emit('resize', {
      width: state.renderer.domElement.clientWidth,
      height: state.renderer.domElement.clientHeight,
    })
  }

  function updateCurrentCamera() {
    if (!state.camera) {
      logError(
        'No camera provided - Please add a <camera> element to your template or use the `useCamera`',
      )
      return false
    }

    if (resize) {
      state.camera.aspect = aspectRatio.value
    } else {
      if (Array.isArray(size)) {
        state.camera.aspect = size[0] / size[1]
      } else {
        state.camera.aspect = size.width / size.height
      }
    }
    state.camera.updateProjectionMatrix()
  }

  /**
   * render scene
   *
   */
  function render() {
    if (!state.renderer) {
      logError(
        'No renderer provided - Please use CreateRenderer before using this hook',
      )
      return
    }
    if (!state.scene) {
      logError(
        'No scene provided - Please add a <scene> element to your template or use the `useScene`',
      )
      return
    }
    if (!state.camera) {
      logError(
        'No camera provided - Please add a <camera> element to your template or use the `useCamera`',
      )
      return
    }
    state.renderer.render(toRaw(state.scene), state.camera)
  }

  const loop = () => {
    // Update renderer
    if (orbitControls) {
      updateOrbitControls()
    }
    emit('updated')
    render()

    requestAnimationFrame(loop)
  }

  return {
    createRenderer,
    initRenderer,
    render,
    updateRenderer,
    initOrbitControls,
    updateOrbitControls,
    state,
  }
}
