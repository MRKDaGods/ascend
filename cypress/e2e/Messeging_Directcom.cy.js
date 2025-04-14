describe('Messaging & Direct Communication', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/messages'); // Adjust for localhost
    });
  
    it('should send a private message to a connection', () => {
      cy.get('#search-conversations').type('John Doe');
      cy.get('.conversation').contains('John Doe').click();
      cy.get('#message-input').type('Hello, John!');
      cy.get('button.send-message').click();
      cy.get('.message').last().should('contain', 'Hello, John!');
    });
  
    it('should send media in a message', () => {
      cy.get('.conversation').first().click();
      cy.get('#message-media-upload').attachFile('image.jpg');
      cy.get('button.send-message').click();
      cy.get('.message').last().find('img').should('be.visible');
    });
  
    it('should load conversation history', () => {
      cy.get('.conversation').first().click();
      cy.get('.message').should('be.visible');
    });
  
    it('should get unseen messages count', () => {
      cy.visit('/home');
      cy.get('.unseen-messages-count').should('be.visible');
    });
  
    it('should mark a conversation as read', () => {
      cy.get('.conversation.unread').first().click();
      cy.get('.conversation.unread').should('not.exist');
    });
  
    it('should mark a conversation as unread', () => {
      cy.get('.conversation').first().click();
      cy.get('button.mark-unread').click();
      cy.get('.conversation').first().should('have.class', 'unread');
    });
  
    it('should block a user from messaging', () => {
      cy.get('.conversation').first().click();
      cy.get('button.block-user').click();
      cy.get('.confirmation-popup').should('be.visible');
      cy.get('button.confirm-block').click();
      cy.get('.success-message').should('contain', 'User blocked');
    });
  
    it('should show read receipts', () => {
      cy.get('.conversation').first().click();
      cy.get('.message').last().find('.read-receipt').should('contain', 'Seen');
    });
  
    it('should show typing indicators', () => {
      cy.get('.conversation').first().click();
      cy.get('.typing-indicator').should('be.visible');
    });
  });