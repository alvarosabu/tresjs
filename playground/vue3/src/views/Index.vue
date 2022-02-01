<script setup lang="ts">
import { ref } from 'vue'

const fov = ref(45)

function onUpdateRender(e) {
  console.log('onUpdateRender', e)
}
setInterval(() => {
  /*   fov.value += 10 */
}, 1000)
</script>
<template>
  <div class="page">
    <TheRenderer alpha resize="window" orbit-controls>
      <TheCamera :position="[5, 5, 15]" :fov="fov"></TheCamera>
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
