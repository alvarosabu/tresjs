import { reactive, watch } from 'vue'
import { Color, Fog, Scene } from 'three'
import gl from '/@/store/basegl'
import { useLogger } from './useLogger'

export function useScene() {
  const { logWarning, logError } = useLogger()

  const state = reactive<{ background: string | null; fog: Fog | null }>({
    background: null,
    fog: null,
  })

  function create({
    background,
    fog,
  }: {
    background: string | undefined
    fog: Fog | undefined
  }) {
    if (gl.scene) {
      logWarning('Scene already created please destroy it first')
      return
    }
    gl.scene = new Scene()
    update({ background, fog })
  }

  function update({
    background,
    fog,
  }: {
    background?: string | undefined | null
    fog?: Fog | undefined | null
  }) {
    if (!gl.scene) {
      logError('Scene not created please create it first')
      return
    }
    if (background) {
      gl.scene.background = new Color(background)
    }
    if (fog) {
      const { color, near = 1, far = 1000 } = fog
      gl.scene.fog = new Fog(new Color(color), near, far)
    }
  }

  watch(state, update)

  return {
    create,
    scene: gl.scene,
    update,
  }
}
