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
      resize
      orbit-controls
      :shadows="PCFSoftShadowMap"
      @init="initRender"
      @created="onCreated"
      @resize="onResize"
    />
  </div>
</template>

<style>
.page {
}
</style>
