<script lang="ts">
import * as THREE from 'three'
import { defineComponent, h, watch } from 'vue'

export default defineComponent({
  name: 'Renderer',
  render() {
    return h('canvas', {
      ref: 'renderer',
    })
  },
})
</script>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRenderer } from '/@/composables/useRenderer'

const renderer = ref(null)

watch(renderer, initRenderer)

const { createRenderer, state } = useRenderer({
  resize: true,
  orbitControls: true,
})

function initRenderer(canvas: HTMLCanvasElement) {
  if (canvas) {
    console.log('initRenderer')
    state.scene = new THREE.Scene()
    state.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    )
    state.camera.position.z = 5
    state.scene.add(state.camera)

    state.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    state.scene.add(new THREE.DirectionalLight(0xffffff, 0.5))
    state.scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshToonMaterial({ color: 'teal' }),
      ),
    )
    createRenderer(canvas)
  }
}
</script>
