<script setup lang="ts">
import { ref } from 'vue'

const shadows = ref(true)
const bg = ref('#000')
/* function onUpdateRender(e) {
  console.log('onUpdateRender', e)
} */
setInterval(() => {
  shadows.value = !shadows.value
  bg.value = shadows.value ? '#000' : '#fff'
}, 8000)
</script>
<template>
  <div class="page">
    <Renderer alpha resize orbit-controls :shadows="shadows">
      <Scene :background="bg"></Scene>
    </Renderer>
  </div>
</template>

<style>
.page {
}
</style>
