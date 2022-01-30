import {
  WebGLRenderer,
  Camera,
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { reactive, computed, ComputedRef } from 'vue'

export interface RootStore {
  instances: { [key: string]: TresInstance }
}
export interface TresInstance {
  renderer: WebGLRenderer | null
  camera: PerspectiveCamera | OrthographicCamera | null
  scene: Scene | null
  controls: OrbitControls | null
}

const gl = reactive<RootStore>({
  instances: {},
})

export default function useGL(instanceId?: string): {
  gl: RootStore
  addInstance: (key: string, instance: TresInstance) => void
  currentGL: ComputedRef<TresInstance>
} {
  function addInstance(key: string, instance: TresInstance): void {
    gl.instances[key] = instance
  }

  const currentGL = computed(
    () => gl.instances[instanceId || Object.keys(gl.instances)[0]],
  )

  return { gl, addInstance, currentGL }
}

/* export const useStore = defineStore('gl', {
  // other options...
  state: () =>
    ({
      renderer: null,
      camera: null,
      scene: null,
      controls: null,
    } as RootStore),
})
 */
