<script setup lang="ts">
import { Vector3 } from 'three'
import { onMounted, watch, watchEffect, getCurrentInstance } from 'vue'
import type { PropType } from 'vue'
import { CameraType, useCamera } from '/@/composables/useCamera'
import useGL from '/@/composables/useGL'
import { VectorFlexibleParams } from '/@/types'

const props = defineProps({
  fov: {
    type: Number,
    default: 75,
  },
  aspect: {
    type: Number,
    default: 1,
  },
  near: {
    type: Number,
    default: 0.1,
  },
  far: {
    type: Number,
    default: 2000,
  },
  type: {
    type: String,
    default: CameraType.Perspective,
  },
  position: {
    type: Object as PropType<VectorFlexibleParams>,
    default: () => new Vector3(0, 0, 0),
  },
  lookAt: { type: Object as PropType<VectorFlexibleParams>, default: null },
})
const ctx = getCurrentInstance()
const { createCamera, updateCamera } = useCamera(
  ctx?.parent?.exposed?.instanceId.value,
)
const { currentGL } = useGL(ctx?.parent?.exposed?.instanceId.value)

watchEffect(() => {
  updateCamera(props)
})

watch(currentGL.value, gl => {
  if (!gl.camera) {
    createCamera(props.type, {
      fov: props.fov,
      aspect: props.aspect,
      near: props.near,
      far: props.far,
      position: props.position,
      lookAt: props.lookAt,
    })
  }
})
</script>

<template></template>
