describe('Notifications', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/notifications'); // Adjust for localhost
    });
  
    it('should display notifications for likes, comments, connection requests, and messages', () => {
      cy.get('.notification').should('be.visible');
      cy.get('.notification').should('contain', 'liked your post')
                             .or('contain', 'commented on your post')
                             .or('contain', 'sent you a connection request')
                             .or('contain', 'sent you a message');
    });//relace home
  
    it('should mark notifications as read', () => {
      cy.get('.notification.unread').first().click();
      cy.get('.notification.unread').should('not.exist');
    });
  
    it('should show unseen notifications count', () => {
      cy.visit('/home');
      cy.get('.unseen-notifications-count').should('be.visible');
    });
  
    it('should allow users to clear notifications', () => {
      cy.get('button.clear-notifications').click();
      cy.get('.confirmation-popup').should('be.visible');
      cy.get('button.confirm-clear').click();
      cy.get('.notification').should('not.exist');
    });//kol wa7ed lw7do
  
    it('should receive push notifications', () => {
      cy.visit('/home');
      cy.wait(5000); // Simulating push notification delay
      cy.get('.push-notification').should('be.visible');
    });
  });