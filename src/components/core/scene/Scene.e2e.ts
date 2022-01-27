import { mount } from '@cypress/vue'
import Renderer from '../renderer/Renderer.vue'
import Scene from './Scene.vue'

describe('Scene', () => {
  let cmp
  let parent

  beforeEach(() => {
    cy.viewport(1200, 800)
  })

  it('should renders a canvas with the scene', () => {
    cmp = mount(Scene, {
      props: {},
    })
    parent = mount(Renderer, {
      props: {},
    })
    cy.get('canvas').should('exist')
  })
})
