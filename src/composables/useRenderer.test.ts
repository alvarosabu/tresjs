import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { beforeEach, expect, it, vi } from 'vitest'
import { useRenderer } from './useRenderer'
const Canvas = require('canvas')
const glContext = require('gl')(1, 1) //headless-gl

let canvasGL: any

beforeEach(() => {
  canvasGL = new Canvas.Canvas(window.innerWidth, window.innerHeight)
  canvasGL.addEventListener = function (_event: any, _func: any, _bind_: any) {}
  console.error = vi.fn()
})

it('should create a renderer when canvas is provided', () => {
  const { createRenderer, gl } = useRenderer({})
  createRenderer(canvasGL, glContext)
  expect(gl.renderer).to.be.instanceOf(WebGLRenderer)
})

it('should prompt an error if no scene is provided', () => {
  const { createRenderer } = useRenderer({})
  createRenderer(canvasGL, glContext)
  expect(console.error).toHaveBeenCalledWith(
    '[TresJS 🪐⚡️] No scene provided - Please add a <scene> element to your template or use the `useScene`',
  )
})

it('should prompt an error if no camera is provided', () => {
  const { createRenderer, gl } = useRenderer({})
  gl.scene = new Scene()
  createRenderer(canvasGL, glContext)
  expect(console.error).toHaveBeenCalledWith(
    '[TresJS 🪐⚡️] No camera provided - Please add a <camera> element to your template or use the `useCamera`',
  )
})

// Not working  Cannot set properties of undefined (setting 'touchAction')
/* it('should create orbit controls if controls', () => {
  const { createRenderer, state, initOrbitControls } = useRenderer({
    orbitControls: true,
  })
  createRenderer(canvasGL, glContext)
  state.scene = new Scene()
  state.camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
  )
  state.scene.add(state.camera)

  initOrbitControls()

  expect(state.controls).to.be.instanceOf(OrbitControls)
}) */
