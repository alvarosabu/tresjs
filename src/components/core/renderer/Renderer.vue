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

function initRenderer(canvas: HTMLCanvasElement) {
  if (canvas) {
    const { createRenderer, render, state } = useRenderer({ canvas })
    state.scene = new THREE.Scene()
    state.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    )

    state.scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(2, 32, 32),
        new THREE.MeshStandardMaterial({ color: 'teal' }),
      ),
    )
    createRenderer()
    render()
  }
}
</script>
