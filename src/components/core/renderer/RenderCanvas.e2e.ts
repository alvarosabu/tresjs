import { mount } from '@cypress/vue'
import Renderer from './RenderCanvas.vue'

describe('Render Canvas', () => {
  let cmp

  beforeEach(() => {
    cy.viewport(1200, 800)
  })

  it('should render a canvas with the scene', () => {
    cmp = mount(Renderer, {
      props: {},
    })
    cy.get('canvas').should('exist')
  })

  it('should renders a canvas with specific size', async () => {
    cmp = mount(Renderer, {
      props: {
        size: [1300, 650],
      },
    })

    cy.get('canvas').should('have.css', 'width', '1300px')
    cy.get('canvas').should('have.css', 'height', '650px')
  })

  it('should resize the canvas depending on the window size', () => {
    cmp = mount(Renderer, {
      props: {
        resize: true,
      },
    })
    cy.viewport(400, 300)
    cy.get('canvas').should('have.css', 'width', '400px')
    cy.get('canvas').should('have.css', 'height', '300px')
  })
})
