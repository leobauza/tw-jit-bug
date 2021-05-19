// type definitions for Cypress object "cy"
/// <reference types="Cypress" />

/**
 * This sample tests the button click on the landing page of FedPack™
 * The js code that controls the buttons functionality is in `src/js/modules/sample.js`
 * To see this test fail you might change the text in the alert in that file to something
 * other than 'a click!'
 */
describe('Button', () => {
  beforeEach(() => {
    // visit the landing page (cypress.json configures the full URL)
    cy.visit('/')
  })

  it('alerts and counts when clicked', () => {
    // Create a stub (ie. a replacement function to track calls)
    // https://docs.cypress.io/api/commands/stub.html
    const stub = cy.stub()

    // Create a listener for alerts that calls the `stub` when an alert happens
    cy.on('window:alert', stub)

    // Visit the landing page (cypress.json configures the full URL)
    cy.visit('/')
      // get the element with the class .btn
      .get('.btn')
      // click the button
      .click()
      // click returns a promise
      .then(() => {
        /**
         * Check that stub (window.alert) was called with "a click!"
         * as the argument.
         */
        expect(stub).to.be.calledWith('a click!')

        // Get the counter element and make sure it contains 1
        cy.get('.counter').contains('1')
      })
      .get('.btn')
      .click()
      .then(() => {
        /**
         * Check that stub (window.alert) is NOT called a second time
         *
         * Could also have used:
         * .calledOnce
         */
        expect(stub).to.have.callCount(1)
        // Get the counter element and make sure it contains 2
        cy.get('.counter').contains('2')
      })
  })
})
