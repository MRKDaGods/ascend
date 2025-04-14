describe('E2E Test for Sign-in Process', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Performs sign-in with valid email and password', () => {
    cy.get('button').contains('Sign in with email').click();
    cy.wait(1000);
    cy.get('button').contains('Sign in with email').click();
    cy.get('p').contains('Sign in using another account').click();
    cy.get('input[type="text"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').contains('Sign in').click();
  });

  it('Fails sign-in with invalid email', () => {
    cy.get('button').contains('Sign in with email').click();
    cy.wait(1000);
    cy.get('button').contains('Sign in with email').click();
    cy.get('p').contains('Sign in using another account').click();
    cy.get('input[type="text"]').type('invalidemail'); // Invalid email format
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').contains('Sign in').click();
  });

  it('Fails sign-in with invalid password', () => {
    cy.get('button').contains('Sign in with email').click();
    cy.wait(1000);
    cy.get('button').contains('Sign in with email').click();
    cy.get('p').contains('Sign in using another account').click();
    cy.get('input[type="text"]').type('test@example.com');
    cy.get('input[type="password"]').type('11'); // Invalid password
    cy.get('button[type="submit"]').contains('Sign in').click();
  });
});