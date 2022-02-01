import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CameraType, useCamera } from './useCamera'
import { Window } from 'happy-dom'
import useGL from '/@/composables/useGL'
import GL from 'gl'
import { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three'
import { useRenderer } from './useRenderer'
import { useScene } from './useScene'

const window = new Window()
const document = window.document

document.body.innerHTML = '<canvas></canvas>'
let canvas = document.querySelector('canvas')
let glContext = GL(100, 100)

beforeEach(() => {
  canvas = document.querySelector('canvas')
  canvas.addEventListener = function (_event: any, _func: any, _bind_: any) {}
  console.error = vi.fn()
})

afterEach(() => {
  const { currentGL } = useGL()
  currentGL.value.scene = null
  currentGL.value.camera = null
  currentGL.value.renderer = null
})

it('should add a perspective camera to the renderer', () => {
  const { createRenderer } = useRenderer({})
  const { currentGL } = useGL()
  const { createScene } = useScene()
  const { createCamera } = useCamera()
  createScene()
  createCamera()
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  expect(currentGL.value.camera).to.be.instanceOf(PerspectiveCamera)
  expect(currentGL.value.camera.type).to.equal('PerspectiveCamera')

  expect(
    currentGL.value.scene.children.find(
      child => child.type === 'PerspectiveCamera',
    ),
  ).to.exist
})

it('should add an orthographic camera to the renderer', () => {
  const { createRenderer } = useRenderer({})
  const { currentGL } = useGL()
  const { createScene } = useScene()
  const { createCamera } = useCamera()
  createScene()
  createCamera(CameraType.Orthographic)
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  expect(currentGL.value.camera).to.be.instanceOf(OrthographicCamera)
  expect(currentGL.value.camera.type).to.equal('OrthographicCamera')
  expect(
    currentGL.value.scene.children.find(
      child => child.type === 'OrthographicCamera',
    ),
  ).to.exist
})

it('should change the position of the camera if passed as an object', () => {
  const { createRenderer } = useRenderer({})
  const { currentGL } = useGL()
  const { createScene } = useScene()
  const { createCamera } = useCamera()
  createScene()
  createCamera(null, { position: { x: 1, y: 2, z: 3 } })
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  expect(currentGL.value.camera.position).to.eql(new Vector3(1, 2, 3))
})

it('should change the position of the camera if passed as an array', () => {
  const { createRenderer } = useRenderer({})
  const { currentGL } = useGL()
  const { createScene } = useScene()
  const { createCamera } = useCamera()
  createScene()
  createCamera(null, { position: [1, 2, 3] })
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  expect(currentGL.value.camera.position).to.eql(new Vector3(1, 2, 3))
})

it('should change the field of view of the camera', () => {
  const { createRenderer } = useRenderer({})
  const { currentGL } = useGL()
  const { createScene } = useScene()
  const { createCamera, updateCamera } = useCamera()
  createScene()
  createCamera(null, { fov: 45 })
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  expect(currentGL.value.camera.fov).to.equal(45)
  updateCamera({ fov: 60 })
  setTimeout(() => {
    expect(currentGL.value.camera.fov).to.equal(60)
  }, 100)
})

it('should change far clipping of the camera', () => {
  const { createRenderer } = useRenderer({})
  const { currentGL } = useGL()
  const { createScene } = useScene()
  const { createCamera, updateCamera } = useCamera()
  createScene()
  createCamera(null, { far: 1000 })
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  expect(currentGL.value.camera.far).to.equal(1000)
  updateCamera({ far: 2000 })
  setTimeout(() => {
    expect(currentGL.value.camera.far).to.equal(2000)
  }, 100)
})

it('should change near clipping of the camera', () => {
  const { createRenderer } = useRenderer({})
  const { currentGL } = useGL()
  const { createScene } = useScene()
  const { createCamera, updateCamera } = useCamera()
  createScene()
  createCamera(null, { near: 0.1 })
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  expect(currentGL.value.camera.near).to.equal(0.1)
  updateCamera({ near: 1 })
  setTimeout(() => {
    expect(currentGL.value.camera.near).to.equal(1)
  }, 100)
})
