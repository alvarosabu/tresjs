<script setup lang="ts">
import * as THREE from 'three'

import { useRenderer, useScene, useCamera, CameraType } from '/@/'
import { onMounted, ref } from 'vue'

const renderer = ref(null)
const { gl, createRenderer } = useRenderer({
  resize: true,
  orbitControls: true,
})

const { createScene } = useScene()
const { createCamera } = useCamera()

onMounted(() => {
  createScene() // Create scene
  if (renderer.value) {
    createCamera(CameraType.Perspective, {
      fov: 75,
      aspect: renderer.value.clientWidth / renderer.value.clientHeight,
      near: 0.1,
      far: 1000,
      position: [5, 5, 15],
    })
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
  <div class="composables-example">
    <canvas ref="renderer"></canvas>
  </div>
</template>

<style>
.composables-example {
  margin: 2rem 0;
  border-radius: 5px;
  aspect-ratio: 16 / 9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
