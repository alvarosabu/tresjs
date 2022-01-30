import {
  WebGLRenderer,
  Camera,
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { reactive } from 'vue'

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

export default function useGL(): {
  gl: RootStore
  addInstance: (key: string, instance: TresInstance) => void
} {
  function addInstance(key: string, instance: TresInstance): void {
    gl.instances[key] = instance
  }
  return { gl, addInstance }
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
