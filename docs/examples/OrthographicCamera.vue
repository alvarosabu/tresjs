<script setup>
import { CameraType } from '/@/composables/useCamera'
import 'virtual:windi.css'

console.log(CameraType.Orthographic)
</script>

<template>
  <div class="example">
    <TheRenderer resize orbit-controls>
      <TheCamera
        :type="CameraType.Orthographic"
        :position="[0, 0, 8]"
      ></TheCamera>
    </TheRenderer>
  </div>
</template>

<style>
.example {
  border-radius: 5px;
  aspect-ratio: 16 / 9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
