describe('Login Test', () => {
  it('should log in with dashboard', () => {
    cy.visit('http://localhost:1102/login');

    cy.get('#input-0').type('duytien0801@gmail.com');

    cy.get('#input-2').type('12345678');

    cy.get('.v-btn').click();

    cy.url().should('eq', 'http://localhost:1102/');
  });


  it('should log in with dashboard fail', () => {
    cy.visit('http://localhost:1102/login');

    cy.get('#input-0').type('duytien0801@gmail.com');

    cy.get('#input-2').type('12345678');

    cy.get('.v-btn').click();

    cy.url().should('not.eq', 'http://localhost:1102/url-fail');
  });
});