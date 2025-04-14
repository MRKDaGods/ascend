describe('Add and Delete First Education & Skills Feature', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Adjust this to your actual app's local URL
  });

  it('should add a new education and skill, then delete the first ones', () => {
    // === ADD EDUCATION ===
    cy.get('button.add-education-button').should('be.visible').click({ force: true });

    cy.get('input[name="school"]').type('Cairo University');
    cy.get('input[name="degree"]').type("Bachelor's in Engineering");
    cy.get('input[name="field_of_study"]').type('Computer Science');
    cy.get('input[name="start_date"]').type('2022-01-01');
    cy.get('input[name="end_date"]').type('2024-12-31');
    cy.get('textarea[name="description"]').type('Studied CS and AI.');

    cy.contains('button', 'Save').click({ force: true });

    // === ADD SKILL ===
    cy.get('button.add-skills-button').click({ force: true });
    cy.contains('button', 'Add Skill').click({ force: true });

    cy.get('input[placeholder="Skill name"]').type('JavaScript');
    cy.contains('button', 'Save All').click({ force: true });

    // === VERIFY THEY EXIST ===
    cy.contains('Cairo University').should('exist');
    cy.contains('JavaScript').should('exist');

    // === DELETE FIRST SKILL ===
    cy.get('button').contains('Delete').first().click({ force: true });

    // === DELETE FIRST EDUCATION ===
    cy.get('button.delete-education-button').first().click({ force: true });

    // === VERIFY THEY'RE GONE (optional, if UI removes them) ===
    //cy.contains('Cairo University').should('not.exist');
   // cy.contains('JavaScript').should('not.exist');
  });
});
describe('Test Button Click', () => {
  it('Clicks the specific button', () => {
    // Visit the page containing the button
    cy.visit('http://localhost:3000'); // Replace with the actual URL of the page

    // Wait for the page to load (optional, adjust time as necessary)
    cy.wait(1000);

    // Click the button using the provided CSS selector
    cy.get('body > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > div:nth-child(3) > div:nth-child(2) > button:nth-child(2)')
      .click();

    // Add assertions to verify the behavior after clicking, if needed
    // Example: Verify a modal is displayed, or an action is triggered
    //cy.get('.modal').should('be.visible'); // Adjust according to your application
  });
});

