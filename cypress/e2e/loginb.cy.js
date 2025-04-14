describe('E2E Test for Sign-in Process', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('Performs sign-in with valid email and password', () => {
      cy.contains('button', 'Sign in with email').click();
      cy.wait(1000);
      cy.contains('p', 'Sign in using another account').click();
      cy.get('input[type="text"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.contains('button', 'Sign in').click();
    });
  
    it('Fails sign-in with invalid email format', () => {
      cy.contains('button', 'Sign in with email').click();
      cy.wait(1000);
      cy.contains('p', 'Sign in using another account').click();
      cy.get('input[type="text"]').type('invalidemail');
      cy.get('input[type="password"]').type('password123');
      cy.contains('button', 'Sign in').click();
    });
  
    it('Fails sign-in with wrong password', () => {
      cy.contains('button', 'Sign in with email').click();
      cy.wait(1000);
      cy.contains('p', 'Sign in using another account').click();
      cy.get('input[type="text"]').type('test@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.contains('button', 'Sign in').click();
    });
  
    it('Fails join with invalid email format', () => {
      cy.contains('button', 'Sign in with email').click();
      cy.wait(1000);
      cy.contains('span', 'Join now').click();
  
      cy.get('#first-name-input').type('invalidemail');
      cy.get('#email-input').type('invalidemail');
      cy.get('#password-input').type('password123');
  
      cy.get('#agree-and-join-button').click();
    });
  
    it('Fails join with weak password', () => {
      cy.contains('button', 'Sign in with email').click();
      cy.wait(1000);
      cy.contains('span', 'Join now').click();
  
      cy.get('#first-name-input').type('John');
      cy.get('#email-input').type('test@email.com');
      cy.get('#password-input').type('pa');
  
      cy.get('#agree-and-join-button').click();
    });
    
    it('Fails join with invalid email format', () => {
        cy.contains('button', 'Sign in with email').click();
        cy.wait(1000);
        cy.contains('span', 'Join now').click();
      
        cy.get('#first-name-input').type('Invalid');
        cy.get('#last-name-input').type('Email');
        cy.get('#email-input').type('invalidemail');
        cy.get('#password-input').type('password123');
      
        cy.get('#agree-and-join-button').click();
      });
      
      it('Fails join with weak password', () => {
        cy.contains('button', 'Sign in with email').click();
        cy.wait(1000);
        cy.contains('span', 'Join now').click();
      
        cy.get('#first-name-input').type('John');
        cy.get('#last-name-input').type('Doe');
        cy.get('#email-input').type('test@email.com');
        cy.get('#password-input').type('pa');
      
        cy.get('#agree-and-join-button').click();
      });
      
  }); 
  