import { Camera, OrthographicCamera, PerspectiveCamera, Vector3 } from 'three'
import { reactive, Ref, ref, watch } from 'vue'
import useGL from '/@/composables/useGL'
import { normalizeVectorFlexibleParam } from '/@/core/utils'
import { VectorFlexibleParams } from '../types'
import { useLogger } from './useLogger'

export interface CameraConfig {
  // PerspectiveCamera
  fov?: number
  aspect?: number
  // OrthographicCamera
  left?: number
  right?: number
  top?: number
  bottom?: number
  near?: number
  far?: number
  position?: VectorFlexibleParams
  lookAt?: VectorFlexibleParams
}

export enum CameraType {
  Perspective = 'Perspective',
  Orthographic = 'Orthographic',
}

const state = reactive<CameraConfig>({
  fov: 75,
  aspect: 1,
  near: 0.1,
  far: 1000,
  left: -window.innerWidth / 2,
  right: window.innerWidth / 2,
  top: window.innerHeight / 2,
  bottom: -window.innerHeight / 2,
  position: { x: 0, y: 0, z: 0 },
  lookAt: { x: 0, y: 0, z: 0 },
})

const type: Ref<CameraType | string> = ref(CameraType.Perspective)

export function useCamera(instanceId?: string) {
  const { logWarning, logError } = useLogger()
  const { currentGL } = useGL(instanceId)

  watch(
    () => state,
    value => {
      if (value) {
        updateCameraRenderer(value)
      }
    },
    { deep: true },
  )

  function createPerspectiveCamera(config: CameraConfig) {
    const { fov, aspect, near, far } = config
    currentGL.value.camera = new PerspectiveCamera(fov, aspect, near, far)
    currentGL.value.scene?.add(currentGL.value.camera as PerspectiveCamera)
    return currentGL.value.camera
  }

  function createOrthographicCamera(config: CameraConfig) {
    const { fov, aspect, near, far } = config
    currentGL.value.camera = new OrthographicCamera(fov, aspect, near, far)
    currentGL.value.scene?.add(currentGL.value.camera as OrthographicCamera)
    return currentGL.value.camera
  }

  function createCamera(
    cameraType?: CameraType | string,
    config?: CameraConfig,
  ) {
    Object.assign(state, config)
    if (cameraType) type.value = cameraType

    if (cameraType === CameraType.Orthographic) {
      createOrthographicCamera(state)
    } else {
      createPerspectiveCamera(state)
    }
    updateCameraRenderer(state)

    return currentGL.value.camera
  }

  function updateCamera(config: CameraConfig) {
    Object.assign(state, config)
  }

  function updateCameraRenderer(config: CameraConfig) {
    const {
      fov,
      aspect,
      near,
      far,
      position,
      lookAt,
      top,
      bottom,
      left,
      right,
    } = config
    if (currentGL.value.camera) {
      if (type.value === CameraType.Perspective) {
        if (fov) (currentGL.value.camera as PerspectiveCamera).fov = fov
        if (aspect)
          (currentGL.value.camera as PerspectiveCamera).aspect = aspect
      }
      if (type.value === CameraType.Orthographic) {
        if (top) (currentGL.value.camera as OrthographicCamera).top = top
        if (bottom)
          (currentGL.value.camera as OrthographicCamera).bottom = bottom
        if (left) (currentGL.value.camera as OrthographicCamera).left = left
        if (right) (currentGL.value.camera as OrthographicCamera).right = right
      }
      if (near) currentGL.value.camera.near = near
      if (far) currentGL.value.camera.far = far
      if (position) {
        const normalizedPosition = normalizeVectorFlexibleParam(position)
        currentGL.value.camera.position.set(
          normalizedPosition.x,
          normalizedPosition.y,
          normalizedPosition.z,
        )
      }
      if (lookAt)
        currentGL.value.camera.lookAt(normalizeVectorFlexibleParam(lookAt))

      currentGL.value.camera.updateProjectionMatrix()
    }
  }

  return {
    createCamera,
    updateCamera,
  }
}
