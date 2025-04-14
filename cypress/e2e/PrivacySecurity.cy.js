describe('Privacy & Security', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/settings/privacy'); // Adjust for localhost
    });
  
    it('should control who can send connection requests', () => {
      cy.get('#connection-request-privacy').select('Connections Only');
      cy.get('button.save-settings').click();
      cy.get('.success-message').should('contain', 'Privacy settings updated');
    });
  
    it('should allow users to report inappropriate posts', () => {
      cy.visit('/feed');
      cy.get('.post').first().find('button.report-post').click();
      cy.get('#report-reason').select('Hate Speech');
      cy.get('button.submit-report').click();
      cy.get('.success-message').should('contain', 'Report submitted');
    });
  
    it('should allow users to block another user', () => {
      cy.visit('/profile/john-doe');
      cy.get('button.block-user').click();
      cy.get('.confirmation-popup').should('be.visible');
      cy.get('button.confirm-block').click();
      cy.get('.success-message').should('contain', 'User blocked');
    });
  
    it('should allow users to unblock a blocked user', () => {
      cy.visit('/settings/blocked-users');
      cy.get('.blocked-user').first().find('button.unblock-user').click();
      cy.get('.success-message').should('contain', 'User unblocked');
    });
  
    it('should manage the blocked users list', () => {
      cy.visit('/settings/blocked-users');
      cy.get('.blocked-user').should('be.visible');
    });
  });