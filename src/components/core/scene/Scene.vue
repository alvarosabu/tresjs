<script setup lang="ts">
import { Fog } from 'three'
import { PropType, ref } from 'vue'

const props = defineProps({
  background: {
    type: String,
  },
  fog: {
    type: Object as PropType<Fog>,
  },
})
const state = ref({})
</script>
<template>
  <slot />
</template>
