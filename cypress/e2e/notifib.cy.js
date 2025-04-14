describe('Notification Module - Mark as Unread', () => {
    it('Marks notification as unread and checks counter updates', () => {

        cy.visit('http://localhost:3000/'); 
      // Step 1: Open More Options for the first notification
      cy.get('[data-testid="MoreVertIcon"]')
        .first()
        .click();
  
      // Step 2: Mark as Unread
      cy.contains('li', 'Mark as Unread').click();
  
      // Step 3: Wait and check counter = 2
      cy.wait(1000);
      cy.get('.MuiBadge-badge')
        .invoke('text')
        .should('eq', '2');
    });
  });


  describe('Notification Module - Mark as Read', () => {
    it('Marks notification as read and checks counter updates', () => {

        cy.visit('http://localhost:3000/'); 
      // Step 1: Open More Options for the first notification
      cy.get('[data-testid="MoreVertIcon"]')
        .first()
        .click();
  
      // Step 2: Mark as Read
      cy.contains('li', 'Mark as Read').click();
  
      // Step 3: Wait and check counter = 1
      cy.wait(1000);
      cy.get('.MuiBadge-badge')
        .invoke('text')
        .should('eq', '1');
    });
  });

    describe('Notification Module - Delete Notification', () => {
  it('Deletes a notification and checks the counter does not decrease', () => {

    cy.visit('http://localhost:3000/'); 

    // Step 1: Open More Options for the first notification
    cy.get('[data-testid="MoreVertIcon"]')
      .first()
      .click();

    // Step 2: Delete the notification
    cy.contains('li', 'Delete').click();

    // Step 3: Wait and check counter is still 1
    cy.wait(1000);
    cy.get('.MuiBadge-badge')
      .invoke('text')
      .should('eq', '1');
  });
});
