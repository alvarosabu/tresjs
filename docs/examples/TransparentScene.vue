<script>
import 'virtual:windi.css'
</script>

<template>
  <div class="example">
    <Renderer alpha resize orbit-controls>
      <Scene></Scene>
    </Renderer>
  </div>
</template>

<style>
.example {
  background: url('/png-transparent-bg.png');
  border-radius: 5px;
  aspect-ratio: 16 / 9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
