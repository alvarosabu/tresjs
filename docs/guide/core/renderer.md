# Renderer

The renderer Component is the portal into [ThreeJS Renderer](https://threejs.org/docs/index.html?q=renderer#api/en/renderers/WebGLRenderer).

```vue
<template>
  <Renderer alpha resize orbit-controls shadow> ... </Renderer>
</template>
```

## Essential

| Prop        | Description                                                                                | Type                   | Value       |
| :---------- | :----------------------------------------------------------------------------------------- | :--------------------- | :---------- |
| `alpha`     | Defines whether the canvas contains an alpha (transparency) buffer or not.                 | Boolean                | `false`     |
| `antialias` | Defines whether the canvas should perform anti-aliasing or not.                            | Boolean                | `false`     |
| `resize`    | Defines whether the canvas should resize itself automatically or not.                      | Boolean                | `false`     |
| `autoClear` | Defines whether the renderer should clear the canvas before rendering.                     | Boolean                | `true`      |
| `shadows`   | Defines whether the renderer should render shadows or not. (false, true, PCFSoftShadowMap) | Boolean, ShadowMapType | `false`     |
| `size`      |  Defines the size of the canvas. Allows values like `[width, height]` or `{width, height}` | Array, Object          | `[800,600]` |

## Misc

| Prop             | Description                                                 | Type    | Value   |
| :--------------- | :---------------------------------------------------------- | :------ | :------ |
|  `orbitControls` | Defines whether the OrbitControls should be enabled or not. | Boolean | `false` |

Orbit controls allow the camera to orbit around a target. Check more [three-js-orbit-controls](https://threejs.org/docs/index.html?q=Orbit#examples/en/controls/OrbitControls)
