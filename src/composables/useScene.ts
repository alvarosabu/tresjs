import { reactive, watch } from 'vue'
import { Color, Fog, Scene } from 'three'
import { useLogger } from './useLogger'
import useGL from './useGL'

export function useScene(instanceId?: string) {
  const { logWarning, logError } = useLogger()
  const { currentGL } = useGL(instanceId)

  const state = reactive<{ background: string | null; fog: Fog | null }>({
    background: null,
    fog: null,
  })

  function create({
    background,
    fog,
  }: {
    background?: string | undefined
    fog?: Fog | undefined
  }) {
    if (currentGL.value.scene) {
      logWarning('Scene already created please destroy it first')
      return
    }
    currentGL.value.scene = new Scene()
    update({ background, fog })
    return currentGL.value.scene
  }

  function update({
    background,
    fog,
  }: {
    background?: string | undefined | null
    fog?: Fog | undefined | null
  }) {
    if (!currentGL.value.scene) {
      logError('Scene not created please create it first')
      return
    }
    if (background) {
      currentGL.value.scene.background = new Color(background)
    }
    if (fog) {
      const { color, near = 1, far = 1000 } = fog
      currentGL.value.scene.fog = new Fog(new Color(color), near, far)
    }
  }

  watch(state, update)

  return {
    create,
    update,
  }
}
