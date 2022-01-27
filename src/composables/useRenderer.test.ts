import { Scene, WebGLRenderer } from 'three'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useRenderer } from './useRenderer'
import { Window } from 'happy-dom'

import GL from 'gl'

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

it('should create a renderer when canvas is provided', () => {
  const { createRenderer, gl } = useRenderer({})
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  expect(gl.renderer).to.be.instanceOf(WebGLRenderer)
})

it('should prompt an error if no scene is provided', () => {
  const { createRenderer } = useRenderer({})
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  expect(console.error).toHaveBeenCalledWith(
    '[TresJS 🪐⚡️] No scene provided - Please add a <scene> element to your template or use the `useScene`',
  )
})

it('should prompt an error if no camera is provided', () => {
  const { createRenderer, gl } = useRenderer({})
  gl.scene = new Scene()
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  expect(console.error).toHaveBeenCalledWith(
    '[TresJS 🪐⚡️] No camera provided - Please add a <camera> element to your template or use the `useCamera`',
  )
})
