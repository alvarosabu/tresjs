<script>
import 'virtual:windi.css'
</script>

<template>
  <div class="example">
    <TheRenderer resize orbit-controls>
      <TheCamera :position="[5, 5, 15]" :fov="75"></TheCamera>
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
