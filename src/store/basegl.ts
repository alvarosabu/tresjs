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
  renderer: WebGLRenderer | null
  camera: PerspectiveCamera | OrthographicCamera | null
  scene: Scene | null
  controls: OrbitControls | null
}

const gl = reactive<RootStore>({
  renderer: null,
  camera: null,
  scene: null,
  controls: null,
})

export default gl

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
