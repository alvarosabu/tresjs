<script setup>
import PerspectiveCamera from '../../examples/PerspectiveCamera.vue'
import OrthographicCamera from '../../examples/OrthographicCamera.vue'
</script>

# Camera

The Camera components allows to create an imaging device that enables the perception of depth in images to replicate three dimensions (In human, it projects the 3d world into 2D image space.) [ThreeJS Camera](https://threejs.org/docs/index.html?q=camera#api/en/cameras/PerspectiveCamera)

```vue
<template>
  <RendererCanvas alpha resize orbit-controls shadow>
    <TheCamera :position="(0, 0, 5)" :near="0.1" :far="1000" />
  </RendererCanvas>
</template>
```

| Prop   | Description                                                                                                                                     | Type               | Value         |
| :----- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- | :------------ |
| `type` | Defines whether the camera is [PerspectiveCamera](https://threejs.org/docs/?q=ortho#api/en/cameras/PerspectiveCamera) or [OrthographicCamera]() | CameraType, String | `perspective` |
| `near` | Defines the near clipping plane.                                                                                                                | Number             | `0.1`         |
| `far`  | Defines the far clipping plane.                                                                                                                 | Number             | `1000`        |

## Perspective Camera

This is the default camera since it's the most commonly used. This projection mode is designed to mimic the way the human eye sees.

```vue
<template>
  <RendererCanvas alpha resize orbit-controls shadow>
    <TheCamera :position="(0, 0, 5)" :fov="45" />
  </RendererCanvas>
</template>
```

| Prop     | Description                           | Type   | Value |
| :------- | :------------------------------------ | :----- | :---- |
| `fov`    | Defines the field of view.            | Number | `45`  |
| `aspect` | Defines camera frustrum aspect ratio. | Number | `1`   |

<PerspectiveCamera />

## Orthographic Camera

Camera that uses orthographic projection.

In this projection mode, an object's size in the rendered image stays constant regardless of its distance from the camera.

This can be useful for rendering 2D scenes and UI elements, amongst other things.

```vue
<template>
  <RendererCanvas alpha resize orbit-controls shadow>
    <TheCamera type="Orthographic" :position="(0, 0, 5)" :fov="45" />
  </RendererCanvas>
</template>
```

| Prop     | Description                  | Type   | Value                |
| :------- | :--------------------------- | :----- | :------------------- |
| `left`   | Camera frustum left plane.   | Number | `-window.width / 2`  |
| `right`  | Camera frustum right plane.  | Number | `window.width / 2`   |
| `top`    | Camera frustum top plane.    | Number | `window.height / 2`  |
| `bottom` | Camera frustum bottom plane. | Number | `-window.height / 2` |

<!-- <OrthographicCamera /> -->
