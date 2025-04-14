describe('Connections & Networking', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/network'); // Adjust for localhost
    });
  
    it('should search for users by name', () => {
      cy.get('#search-bar').type('John Doe');
      cy.get('button.search').click();
      cy.get('.user-card').should('contain', 'John Doe');
    });
  
    it('should send a connection request', () => {
      cy.get('.user-card').contains('John Doe').parent().find('button.connect').click();
      cy.get('.success-message').should('contain', 'Connection request sent');
    });
  
    it('should accept a connection request', () => {
      cy.visit('/network/requests'); // Adjust for your app
      cy.get('.connection-request').first().find('button.accept').click();
      cy.get('.success-message').should('contain', 'You are now connected');
    });
  
    it('should decline a connection request', () => {
      cy.visit('/network/requests');
      cy.get('.connection-request').first().find('button.decline').click();
      cy.get('.success-message').should('contain', 'Connection request declined');
    });
  
    it('should remove a connection', () => {
      cy.visit('/connections');
      cy.get('.connection-card').contains('John Doe').parent().find('button.remove').click();
      cy.get('.success-message').should('contain', 'Connection removed');
    });
  
    it('should follow a user without connecting', () => {
      cy.visit('/profile/johndoe');
      cy.get('button.follow').click();
      cy.get('.success-message').should('contain', 'You are now following John Doe');
    });
  
    it('should list pending connection requests', () => {
      cy.visit('/network/requests');
      cy.get('.connection-request').should('be.visible');
    });
  
    it('should block a user', () => {
      cy.visit('/profile/johndoe');
      cy.get('button.block').click();
      cy.get('.confirmation-popup').should('be.visible');
      cy.get('button.confirm-block').click();
      cy.get('.success-message').should('contain', 'User blocked successfully');
    });
  
    it('should unblock a user', () => {
      cy.visit('/settings/blocked-users');
      cy.get('.blocked-user').contains('John Doe').parent().find('button.unblock').click();
      cy.get('.success-message').should('contain', 'User unblocked');
    });
  
    it('should send a messaging request to a non-connection', () => {
      cy.visit('/profile/johndoe');
      cy.get('button.message-request').click();
      cy.get('.success-message').should('contain', 'Message request sent');
    });
  });