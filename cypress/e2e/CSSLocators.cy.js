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
  it('Performs sign-in using Join now option', () => {
    cy.get('button').contains('Sign in with email').click();
    cy.wait(1000);
    cy.get('span').contains('Join now').click();
    cy.get('input[id="r3b"]').type('test@example.com');
    cy.get('input[id="rg"]').type('password123');
    cy.get('button[type="submit"]').contains('Sign in').click();
  });

  it('Fails sign-in using Join now with invalid email', () => {
    cy.get('button').contains('Sign in with email').click();
    cy.wait(1000);
    cy.get('span').contains('Join now').click();
    cy.get('input[id="r3b"]').type('invalidemail'); // Invalid email format
    cy.get('input[id="rg"]').type('password123');
    cy.get('button[type="submit"]').contains('Sign in').click();
  });

  it('Fails sign-in using Join now with invalid password', () => {
    cy.get('button').contains('Sign in with email').click();
    cy.wait(1000);
    cy.get('span').contains('Join now').click();
    cy.get('input[id="r3b"]').type('test@example.com');
    cy.get('input[id="rg"]').type('wrongpassword'); // Invalid password
    cy.get('button[type="submit"]').contains('Sign in').click();
  });
});
