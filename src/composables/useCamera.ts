import { Camera, PerspectiveCamera, Vector3 } from 'three'
import { reactive, watch } from 'vue'
import useGL from '/@/composables/useGL'
import { normalizeVectorFlexibleParam } from '/@/core/utils'
import { VectorFlexibleParams } from '../types'
import { useLogger } from './useLogger'

export interface CameraConfig {
  fov?: number
  aspect?: number
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
  position: { x: 0, y: 0, z: 0 },
  lookAt: { x: 0, y: 0, z: 0 },
})

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
  )

  function createPerspectiveCamera(config: CameraConfig) {
    const { fov, aspect, near, far } = config
    currentGL.value.camera = new PerspectiveCamera(fov, aspect, near, far)
    return currentGL.value.camera
  }

  function createCamera(
    type: CameraType = CameraType.Perspective,
    config: CameraConfig,
  ) {
    Object.assign(state, config)

    if (type === CameraType.Orthographic) {
      createPerspectiveCamera(config)
    } else {
      createPerspectiveCamera(config)
    }
    updateCameraRenderer(config)
    currentGL.value.scene.add(currentGL.value.camera)
    return currentGL.value.camera
  }

  function updateCamera(config: CameraConfig) {
    Object.assign(state, config)
  }

  function updateCameraRenderer(config: CameraConfig) {
    const { fov, aspect, near, far, position, lookAt } = config
    if (currentGL.value.camera) {
      if (fov) currentGL.value.camera.fov = fov
      if (aspect) currentGL.value.camera.aspect = aspect
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
    }
  }

  return {
    createCamera,
    updateCamera,
  }
}
