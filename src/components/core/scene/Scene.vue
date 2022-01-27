<script setup lang="ts">
import { Fog } from 'three'
import { onBeforeUnmount, onMounted, PropType, watch } from 'vue'
import { useLogger } from '/@/composables/useLogger'
import { useScene } from '/@/composables/useScene'
import gl from '/@/store/basegl'

const props = defineProps({
  background: {
    type: String,
  },
  fog: {
    type: Object as PropType<Fog>,
  },
})

const { create, scene, update } = useScene()
const { logMessage } = useLogger()

watch(props, value => {
  update({
    background: value.background,
    fog: value.fog,
  })
})

watch(
  () => props.fog,
  val => {
    update({ fog: val })
  },
)

onMounted(() => {
  create({
    background: props.background,
    fog: props.fog,
  })
})

onBeforeUnmount(() => {
  gl.scene = null
})

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', data => {
    logMessage('scene:vite:beforeUpdate', data)
    gl.scene = null
    create({
      background: props.background,
      fog: props.fog,
    })
  })
}
</script>
<template>
  <slot />
</template>
