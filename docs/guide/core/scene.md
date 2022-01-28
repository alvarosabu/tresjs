<script setup>
import TransparentScene from '../../examples/TransparentScene.vue'
import FogScene from '../../examples/Fog.vue'
</script>

# Scene

The `<Scene />` Component allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras. [ThreeJS Scene](https://threejs.org/docs/index.html?q=scene#api/en/scenes/WebGLScene).

```vue
<template>
  <Renderer alpha resize orbit-controls shadow>
    <Scene> ... </Scene>
  </Renderer>
</template>
```

## Essential

| Prop         | Description                                                                                    | Type         | Value |
| :----------- | :--------------------------------------------------------------------------------------------- | :----------- | :---- |
| `background` | Sets the background used when rendering the scene, and is always rendered first                | String       |       |
| `fog`        | Defines whether the scene renders a linear fog (that grows linearly denser with the distance.) | Boolean, Fog |       |

## Transparent Scene

<!-- <TransparentScene /> -->

You can achieve a transparent rendering by setting the `alpha` property to the [Renderer Component](#Renderer).

```vue{3}
<template>
  <div class="example">
    <Renderer alpha resize orbit-controls>
      <Scene>...</Scene>
    </Renderer>
  </div>
</template>

<style>
.example {
  background: url('/png-transparent-bg.png');
}
</style>
```

## Fog

You can achieve a fog rendering by setting the `fog` to a valid instances of [Fog](https://threejs.org/docs/#api/en/scenes/Fog) Class `new THREE.Fog(color, near, far)`.

```vue{3}
<template>
  <Renderer resize orbit-controls>
    <Scene background="gray" :fog="{ color: 'gray', near: 1, far: 15 }"></Scene>
  </Renderer>
</template>
```

<FogScene />
