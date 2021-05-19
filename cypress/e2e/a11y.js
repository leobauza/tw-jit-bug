// type definitions for Cypress object "cy"
/// <reference types="Cypress" />

/**
 * This basic a11y test checks a11y on the landing page
 * with cypress-axe (using axe-core under the hood)
 *
 * see: https://github.com/avanslaars/cypress-axe
 * see: https://github.com/dequelabs/axe-core
 * see: https://www.deque.com/blog/how-to-test-for-accessibility-with-cypress/
 */
describe('Accessibility', () => {
  // before each `it` do this.
  beforeEach(() => {
    // visit the landing page (cypress.json configures the full URL)
    cy.visit('/')
  })

  it('passes aXe check', () => {
    // inject the axe-core library
    cy.injectAxe()
    /**
     * Perform basic a11y check
     *
     * notes:
     * - `checkAlly()` takes a selector as a parameter to narrow the a11y check
     * - A `checkAlly()` should be called after things change on a page
     */
    cy.checkA11y()
  })
})
