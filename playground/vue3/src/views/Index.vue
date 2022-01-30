<script setup lang="ts">
import { ref } from 'vue'

const shadows = ref(true)

/* function onUpdateRender(e) {
  console.log('onUpdateRender', e)
} */
setInterval(() => {
  shadows.value = !shadows.value
}, 8000)
</script>
<template>
  <div class="page">
    <TheRenderer alpha resize="window" orbit-controls :shadows="shadows">
      <TheCamera :position="[5, 5, 15]"></TheCamera>
    </TheRenderer>
    <!-- <Renderer alpha resize="window" orbit-controls :shadows="shadows">
      <Scene
        background="gray"
        :fog="{ color: 'gray', near: 1, far: 15 }"
      ></Scene>
    </Renderer> -->
  </div>
</template>

<style>
.page {
  width: 50%;
}
</style>
