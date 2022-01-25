import {
  Camera,
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
  WebGLRendererParameters,
} from 'three'
import { computed, reactive, watch, toRaw } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useWindowSize } from '@vueuse/core'

import { useLogger } from './useLogger'

export type RendererSize = {
  width: number
  height: number
  wWidth: number
  wHeight: number
  ratio: number
}

export interface RendererConfig extends WebGLRendererParameters {
  orbitControls?: boolean
  shadows?: boolean
  resize?: boolean
  width?: number
  height?: number
  onResize?(size: RendererSize): void
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
  } = config

  const { width, height } = useWindowSize()
  const aspectRatio = computed(() => width.value / height.value)

  watch(aspectRatio, updateRenderer)
  watch(aspectRatio, updateCurrentCamera)

  const { logError } = useLogger()

  /**
   * create WebGLRenderer
   */
  function createRenderer(
    canvas: HTMLCanvasElement,
    context: any,
  ): WebGLRenderer {
    const setup = {
      canvas,
      antialias,
      alpha,
    }
    if (context) {
      setup.context = context
    }
    try {
      state.renderer = new WebGLRenderer(setup)
    } catch (error) {
      logError(error)
      return
    }

    if (shadows) {
      state.renderer.shadowMap.enabled = true
      state.renderer.shadowMap.type = PCFSoftShadowMap // TODO: add option to change this for other types
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
        logError(error)
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
      state.renderer.setSize(800, 600)
    }
  }

  function updateCurrentCamera() {
    state.camera.aspect = aspectRatio.value
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
