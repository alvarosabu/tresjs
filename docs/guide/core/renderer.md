<script setup>
import TransparentScene from '../../examples/TransparentScene.vue'
import FogScene from '../../examples/Fog.vue'
</script>

# Renderer

The renderer Component is the portal into [ThreeJS Renderer](https://threejs.org/docs/index.html?q=renderer#api/en/renderers/WebGLRenderer).

The `<RendererCanvas />` Component allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras. [ThreeJS Scene](https://threejs.org/docs/index.html?q=scene#api/en/scenes/WebGLScene).

```vue
<template>
  <RendererCanvas alpha resize orbit-controls shadow> </RendererCanvas>
</template>
```

## Essential

| Prop        | Description                                                                                                                        | Type                   | Value       |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------- | :--------------------- | :---------- |
| `alpha`     | Defines whether the canvas contains an alpha (transparency) buffer or not.                                                         | Boolean                | `false`     |
| `antialias` | Defines whether the canvas should perform anti-aliasing or not.                                                                    | Boolean                | `false`     |
| `resize`    | Defines whether the canvas should resize itself automatically or not. (alse : disabled, true : parent size 'window' : window size) | Boolean, String        | `false`     |
| `autoClear` | Defines whether the renderer should clear the canvas before rendering.                                                             | Boolean                | `true`      |
| `shadows`   | Defines whether the renderer should render shadows or not. (false, true, PCFSoftShadowMap)                                         | Boolean, ShadowMapType | `false`     |
| `size`      |  Defines the size of the canvas. Allows values like `[width, height]` or `{width, height}`                                         | Array, Object          | `[800,600]` |

## Misc

| Prop                      | Description                                                                                    | Type         | Value   |
| :------------------------ | :--------------------------------------------------------------------------------------------- | :----------- | :------ |
|  `orbitControls`          | Defines whether the OrbitControls should be enabled or not.                                    | Boolean      | `false` |
| `background`              | Sets the background used when rendering the scene, and is always rendered first                | String       |         |
| `fog`                     | Defines whether the scene renders a linear fog (that grows linearly denser with the distance.) | Boolean, Fog |         |
| `physicallyCorrectLights` | Whether to use physically correct lighting mode. Default is false.                             | Boolean      |         |

Orbit controls allow the camera to orbit around a target. Check more [three-js-orbit-controls](https://threejs.org/docs/index.html?q=Orbit#examples/en/controls/OrbitControls)

## Transparent Scene

<TransparentScene />

You can achieve a transparent rendering by setting the `alpha` property to the [Renderer Component](#Renderer).

```vue{3}
<template>
  <div class="example">
    <RendererCanvas alpha resize orbit-controls>
    </RendererCanvas>
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

```vue{2}
<template>
  <RendererCanvas background="gray" :fog="{ color: 'gray', near: 1, far: 15 }">

  </RendererCanvas>
</template>
```

<FogScene />
