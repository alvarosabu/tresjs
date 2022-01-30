import { Color, Fog, Scene } from 'three'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useRenderer } from './useRenderer'
import { useScene } from './useScene'
import { Window } from 'happy-dom'
import useGL from '/@/store/basegl'
import GL from 'gl'
let glContext = GL(100, 100)

const window = new Window()
const document = window.document

document.body.innerHTML = '<canvas></canvas>'
let canvas = document.querySelector('canvas')

beforeEach(() => {
  canvas = document.querySelector('canvas')
  canvas.addEventListener = function (_event: any, _func: any, _bind_: any) {}
  console.error = vi.fn()
  console.warn = vi.fn()
})

afterEach(() => {
  const { currentGL } = useGL()
  currentGL.value.scene = null
  currentGL.value.camera = null
  currentGL.value.renderer = null
})

it('should create a scene', () => {
  const { currentGL } = useGL()
  const { createRenderer } = useRenderer({})
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  const { create } = useScene()
  create({})

  expect(currentGL.value.scene).to.be.instanceOf(Scene)
})

it('should change background of scene', () => {
  const { currentGL } = useGL()
  const { createRenderer } = useRenderer({})
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  const { create, update } = useScene()
  create({})
  update({ background: '#444' })

  expect(currentGL.value.scene.background).to.deep.equal(new Color('#444'))
})

it('should change fog of scene', () => {
  const { currentGL } = useGL()
  const { createRenderer } = useRenderer({})
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  const { create, update } = useScene()
  create({})
  update({ fog: { color: '#444' } })

  expect(currentGL.value.scene.fog).to.deep.equal(new Fog('#444', 1, 1000))
})

it('should update a scene if config parameters changes', () => {
  const { currentGL } = useGL()
  const { createRenderer } = useRenderer({})
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)
  const { create, update } = useScene()
  create({})
  update({ background: '#444' })
  update({ fog: { color: '#444' } })

  expect(currentGL.value.scene.background).to.deep.equal(new Color('#444'))
  expect(currentGL.value.scene.fog).to.deep.equal(new Fog('#444', 1, 1000))
})

it('should give a warning if scene is already initialized', () => {
  const { currentGL } = useGL()
  const { createRenderer } = useRenderer({})
  createRenderer(canvas as unknown as HTMLCanvasElement, glContext)

  currentGL.value.scene = new Scene()

  const { create } = useScene()
  create({})
  expect(console.warn).toHaveBeenCalledWith(
    '[TresJS 🪐⚡️] Scene already created please destroy it first',
  )
})

it('should give an error if scene is updated without being created', () => {
  const { update } = useScene()
  update({ background: '#444' })
  expect(console.error).toHaveBeenCalledWith(
    '[TresJS 🪐⚡️] Scene not created please create it first',
  )
})
