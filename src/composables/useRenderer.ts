import {
  Camera,
  Scene,
  ShadowMapType,
  WebGLRenderer,
  WebGLRendererParameters,
} from 'three'
import { computed, watch, toRaw, getCurrentInstance } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { isBoolean, useWindowSize } from '@vueuse/core'
import gl from '/@/store/basegl'

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
      /*  gl.setRenderer(new WebGLRenderer(setup)) */
      gl.renderer = new WebGLRenderer(setup)
      emit('created', gl.renderer)
    } catch (error) {
      logError(error as string)
      return null
    }

    if (shadows) {
      gl.renderer.shadowMap.enabled = true
      if (!isBoolean(shadows)) {
        gl.renderer.shadowMap.type = shadows as ShadowMapType
      }
    }

    initRenderer()
    return gl.renderer
  }

  /**
   * init WebGLRenderer
   */
  function initRenderer() {
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
    if (!gl.controls && gl.renderer && gl.camera) {
      try {
        gl.controls = new OrbitControls(gl.camera, gl.renderer.domElement)
        gl.controls.enableDamping = true
        emit('controlsCreated', gl.controls)
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
    if (!gl.controls) {
      logError(
        'No controls provided - Please initialize the controls with `initOrbitControls`',
      )
      return
    }
    gl.controls.update()
  }

  /**
   * update renderer
   */
  function updateRenderer() {
    if (!gl.renderer) {
      logError(
        'No renderer provided - Please use CreateRenderer before using this hook',
      )
      return
    }

    if (resize) {
      gl.renderer.setSize(width.value, height.value)
      gl.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    } else {
      if (Array.isArray(size)) {
        gl.renderer.setSize(size[0], size[1])
      } else {
        gl.renderer.setSize(size.width, size.height)
      }
    }

    emit('resize', {
      width: gl.renderer.domElement.clientWidth,
      height: gl.renderer.domElement.clientHeight,
    })
  }

  function updateCurrentCamera() {
    if (!gl.camera) {
      logError(
        'No camera provided - Please add a <camera> element to your template or use the `useCamera`',
      )
      return false
    }

    if (resize) {
      gl.camera.aspect = aspectRatio.value
    } else {
      if (Array.isArray(size)) {
        gl.camera.aspect = size[0] / size[1]
      } else {
        gl.camera.aspect = size.width / size.height
      }
    }
    gl.camera.updateProjectionMatrix()
  }

  /**
   * render scene
   *
   */
  function render() {
    if (!gl.renderer) {
      logError(
        'No renderer provided - Please use CreateRenderer before using this hook',
      )
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
    gl.renderer.render(toRaw(gl.scene), gl.camera)
  }

  const loop = () => {
    // Update renderer
    try {
      if (orbitControls) {
        updateOrbitControls()
      }
      emit('updated')
      render()
    } catch (error) {}

    requestAnimationFrame(loop)
  }

  return {
    createRenderer,
    initRenderer,
    render,
    updateRenderer,
    initOrbitControls,
    updateOrbitControls,
  }
}
