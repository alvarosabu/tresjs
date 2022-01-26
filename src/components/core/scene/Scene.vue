<script setup lang="ts">
import { onMounted, PropType, watch } from 'vue'
import { TresFog, useScene } from '/@/composables/useScene'

const props = defineProps({
  background: {
    type: String,
  },
  fog: {
    type: Object as PropType<TresFog>,
  },
})

const { create, scene, update } = useScene()

watch(
  () => [props.background, props.fog],
  ([background, fog]) => {
    update({
      background,
      fog,
    })
  },
)

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
</script>
<template>
  <slot />
</template>
