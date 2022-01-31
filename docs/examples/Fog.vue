<script>
import 'virtual:windi.css'
</script>

<template>
  <div class="fog-example">
    <TheRenderer
      alpha
      resize
      orbit-controls
      background="gray"
      :fog="{ color: 'gray', near: 1, far: 15 }"
    >
      <TheCamera :position="[5, 5, 15]"></TheCamera>
    </TheRenderer>
  </div>
</template>

<style>
.fog-example {
  border-radius: 5px;
  aspect-ratio: 16 / 9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
