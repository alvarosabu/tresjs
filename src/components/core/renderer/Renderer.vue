<script lang="ts" setup>
import * as THREE from 'three'
import { ShadowMapType } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ref, watch, PropType } from 'vue'
import { useRenderer } from '/@/composables/useRenderer'
import { SizeFlexibleParams } from '/@/types'

const props = defineProps({
  alpha: {
    // Defines whether the canvas contains an alpha (transparency) buffer or not.
    type: Boolean,
    default: false,
  },
  antialias: {
    // Defines whether to apply antialiasing or not.
    type: Boolean,
    default: false,
  },
  autoClear: {
    // Defines whether the renderer should clear the canvas before rendering.
    type: Boolean,
    default: true,
  },
  resize: {
    // Defines whether the renderer should be resized automatically.
    /*     Resize canvas on window resize.
    false : disabled
    true : parent size
    'window' : window size */
    type: [Boolean, String] as PropType<boolean | string>,
    default: false,
  },
  size: {
    // The size of the canvas.
    type: [Array, Object] as PropType<SizeFlexibleParams>,
    default: () => [800, 600],
  },
  shadows: {
    // Defines whether to render shadows or not. Is possible to pass the ShadowMapType.
    type: [Boolean, Number] as PropType<boolean | ShadowMapType>,
    default: false,
  },
  orbitControls: {
    // Defines whether to use orbit controls or not.
    type: [Boolean, Object] as PropType<boolean | OrbitControls>,
    default: false,
  },
})

const emit = defineEmits([
  'init',
  'created',
  'resize',
  'updated',
  'controlsCreated',
])

const renderer = ref(null)

const { createRenderer, state } = useRenderer({
  alpha: props.alpha,
  antialias: props.antialias,
  resize: props.resize,
  orbitControls: props.orbitControls,
  shadows: props.shadows,
  size: props.size,
})

function initRenderer(canvas: HTMLCanvasElement) {
  if (canvas) {
    emit('init')
    state.scene = new THREE.Scene()
    state.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    )
    state.camera.position.set(5, 5, 15)
    state.scene.add(state.camera)

    state.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const sun = new THREE.DirectionalLight(0xffffff, 0.8)
    sun.position.set(8, 8, 8)
    sun.castShadow = true
    state.scene.add(sun)

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshToonMaterial({ color: '#EFAC35' }),
    )
    sphere.position.set(0, 5, 0)
    sphere.castShadow = true
    state.scene.add(sphere)

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30, 10, 10),
      new THREE.MeshStandardMaterial({ color: '#444' }),
    )

    plane.rotation.set(-Math.PI / 2, 0, 0)
    plane.receiveShadow = true
    state.scene.add(plane)
    const renderObj = createRenderer(canvas)

    console.log(renderObj)
  }
}

watch(renderer, initRenderer)
</script>
<template>
  <canvas ref="renderer"></canvas>
  <slot></slot>
</template>
