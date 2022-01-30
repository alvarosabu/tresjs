<script setup>
  import Composables from '../../examples/Composables.vue'
</script>

# Composables

<Composables />

If you want to have more control and a similar workflow of the original **ThreeJS** you can build ur own canvas by using the composition API utilities built-in in **TresJS**.

```vue
<script setup lang="ts">
import * as THREE from 'three'

import { useRenderer, useScene } from '../../dist/tres.es'
import { onMounted, ref } from 'vue'

const renderer = ref(null)
const { gl, createRenderer } = useRenderer({
  resize: true,
  orbitControls: true,
})

const { create, update } = useScene()

onMounted(() => {
  create({}) // Create scene
  if (renderer.value) {
    gl.camera = new THREE.PerspectiveCamera(
      75,
      renderer.value.clientWidth / renderer.value.clientHeight,
      0.1,
      1000,
    )
    gl.camera.position.set(5, 5, 15)
    gl.scene?.add(gl.camera)
    gl.scene?.add(new THREE.AmbientLight(0xffffff, 0.5))

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshToonMaterial({ color: '#EFAC35' }),
    )
    sphere.position.set(0, 5, 0)
    sphere.castShadow = true
    gl.scene?.add(sphere)

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30, 10, 10),
      new THREE.MeshStandardMaterial({ color: '#444' }),
    )

    plane.rotation.set(-Math.PI / 2, 0, 0)
    plane.receiveShadow = true
    gl.scene?.add(plane)

    createRenderer(renderer.value)
  }
})
</script>
<template>
  <canvas ref="renderer"></canvas>
</template>
```
