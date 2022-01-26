<script setup lang="ts">
import { PCFSoftShadowMap } from 'three'

function initRender(e) {
  console.log('initRender', e)
}

function onCreated(e) {
  console.log('onCreated', e)
}

function onResize(e) {
  console.log('onResize', e)
}

/* function onUpdateRender(e) {
  console.log('onUpdateRender', e)
} */
</script>
<template>
  <div class="page">
    <Renderer
      alpha
      resize
      orbit-controls
      :shadows="PCFSoftShadowMap"
      @init="initRender"
      @created="onCreated"
      @resize="onResize"
    >
      <Scene
        background="gray"
        :fog="{ color: 'gray', near: 1, far: 15 }"
      ></Scene>
    </Renderer>
  </div>
</template>

<style>
.page {
}
</style>
