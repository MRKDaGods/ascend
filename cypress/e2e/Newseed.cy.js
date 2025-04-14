describe('News Feed & Posts', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/feed'); // Adjust for localhost
    });
  
    it('should display posts from connections and followed users', () => {
      cy.get('.post').should('be.visible');
    });
  
    it('should create a text post', () => {
      cy.get('#post-textarea').type('This is my first post!');
      cy.get('button.post').click();
      cy.get('.success-message').should('contain', 'Post created successfully');
      cy.get('.post').first().should('contain', 'This is my first post!');
    });
  
    it('should add media to a post', () => {
      cy.get('#post-textarea').type('Check out this image!');
      cy.get('#post-media-upload').attachFile('image.jpg');
      cy.get('button.post').click();
      cy.get('.success-message').should('contain', 'Post created successfully');
      cy.get('.post').first().should('contain', 'Check out this image!');
      cy.get('.post').first().find('img').should('be.visible');
    });
  
    it('should edit a post', () => {
      cy.get('.post').first().find('button.edit').click();
      cy.get('#post-textarea').clear().type('Updated post content!');
      cy.get('button.save').click();
      cy.get('.success-message').should('contain', 'Post updated successfully');
      cy.get('.post').first().should('contain', 'Updated post content!');
    });
  
    it('should delete a post', () => {
      cy.get('.post').first().find('button.delete').click();
      cy.get('.confirmation-popup').should('be.visible');
      cy.get('button.confirm-delete').click();
      cy.get('.success-message').should('contain', 'Post deleted successfully');
    });
  
    it('should like a post', () => {
      cy.get('.post').first().find('button.like').click();
      cy.get('.like-count').first().should('contain', '1');
    });
  
    it('should comment on a post', () => {
      cy.get('.post').first().find('.comment-section textarea').type('Great post!');
      cy.get('.post').first().find('button.comment-submit').click();
      cy.get('.success-message').should('contain', 'Comment added');
      cy.get('.comment').first().should('contain', 'Great post!');
    });
  
    it('should share a post', () => {
      cy.get('.post').first().find('button.share').click();
      cy.get('.success-message').should('contain', 'Post shared successfully');
    });
  
    it('should tag a user in a post', () => {
      cy.get('#post-textarea').type('Shoutout to @JohnDoe for the amazing work!');
      cy.get('button.post').click();
      cy.get('.post').first().should('contain', 'Shoutout to @JohnDoe');
    });
  
    it('should search for posts by keyword', () => {
      cy.get('#search-posts').type('Cypress Testing');
      cy.get('button.search').click();
      cy.get('.post').should('contain', 'Cypress Testing');
    });
  
    it('should view post engagement metrics', () => {
      cy.get('.post').first().find('.engagement-metrics').should('be.visible');
      cy.get('.post').first().find('.like-count').should('not.be.empty');
      cy.get('.post').first().find('.comment-count').should('not.be.empty');
    });
  
    it('should save a post for later reading', () => {
      cy.get('.post').first().find('button.save').click();
      cy.get('.success-message').should('contain', 'Post saved');
      cy.visit('/saved-posts');
      cy.get('.post').should('be.visible');
    });
  });