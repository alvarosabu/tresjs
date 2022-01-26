<script setup lang="ts">
import { PCFSoftShadowMap } from 'three'
</script>
<template>
  <div class="page">
    <Renderer resize orbit-controls :shadows="PCFSoftShadowMap" />
  </div>
</template>

<style>
.page {
}
</style>
