describe('Add and Delete First Education & Skills Feature', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should add a new education', () => {
    cy.get('button.add-education-button').should('be.visible').click({ force: true });
    cy.get('input[name="school"]').type('Cairo University');
    cy.get('input[name="degree"]').type("Bachelor's in Engineering");
    cy.get('input[name="field_of_study"]').type('Computer Science');
    cy.get('input[name="start_date"]').type('2022-01-01');
    cy.get('input[name="end_date"]').type('2024-12-31');
    cy.get('textarea[name="description"]').type('Studied CS and AI.');
    cy.contains('button', 'Save').click({ force: true });
  });

  it('should add a skill', () => {
    cy.get('button.add-skills-button').click({ force: true });
    cy.contains('button', 'Add Skill').click({ force: true });
    cy.get('input[placeholder="Skill name"]').type('JavaScript');
    cy.contains('button', 'Save All').click({ force: true });
  });

  it('should verify added education and skill exist', () => {
    cy.contains('Cairo University').should('exist');
    //cy.contains('JavaScript').should('exist');
  });

  it('should delete the first skill', () => {
    cy.get('button').contains('Delete').first().click({ force: true });
  });

  it('should delete the first education', () => {
    cy.get('.education-item').first().click({ force: true });
  });
});

describe('Test Button Click', () => {
  it('should click the specific button', () => {
    cy.visit('http://localhost:3000');
    cy.wait(1000);
    cy.get('body > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > div:nth-child(3) > div:nth-child(2) > button:nth-child(2)')
      .click();
  });
});

describe('Add and Delete Experience Flow', () => {
  it('should add experience', () => {
    cy.visit('http://localhost:3000');
    cy.get("div[class='experience-section'] button").click();
    cy.get("body > div:nth-child(1) > div:nth-child(2) > div:nth-child(9) > div:nth-child(1) > form:nth-child(2) > button:nth-child(1)").click();
    cy.get("body > div:nth-child(1) > div:nth-child(2) > div:nth-child(9) > div:nth-child(1) > form:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)").type('Frontend Developer');
    cy.get("body > div:nth-child(1) > div:nth-child(2) > div:nth-child(9) > div:nth-child(1) > form:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > input:nth-child(2)").type('TechCorp');
    cy.get("div[class='linkedin-profile'] div div form div div div textarea").type('Worked on building UI components using React and TailwindCSS.');
    cy.wait(500);
    cy.get("input[type='date']").eq(0).clear().type('2024-01-01');
    cy.get("input[type='date']").eq(1).clear().type('2025-04-01');
    cy.get("body > div:nth-child(1) > div:nth-child(2) > div:nth-child(9) > div:nth-child(1) > form:nth-child(2) > button:nth-child(3)").click();
    cy.wait(1000);
  });

  it('should delete experience', () => {
    cy.wait(500);
    cy.get("div[class='experience-section'] div button").first().click();
  });
});

describe('Upload Photo and Resume Feature', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should upload a profile photo and a resume file', () => {
    cy.get('.profile-picture-container').click();
    cy.get('button.modal-button').contains('Edit').click();
    cy.fixture('My First Test -- verify test - (failed).png', 'base64').then(fileContent => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/png');
      const testFile = new File([blob], 'My First Test -- verify test - (failed).png', { type: 'image/png' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      cy.get('input[type="file"]').first().then(input => {
        const el = input[0];
        el.files = dataTransfer.files;
        input.trigger('change', { force: true });
      });
    });

    cy.get('button.upload-resume-button')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    cy.fixture('Diet_Plan_Arabic.docx', 'base64').then(fileContent => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      const testFile = new File([blob], 'Diet_Plan_Arabic.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      cy.get('input[type="file"]').last().then(input => {
        const el = input[0];
        el.files = dataTransfer.files;
        input.trigger('change', { force: true });
      });
      cy.get('input[type="file"]').last().should($input => {
        expect($input[0].files[0].name).to.equal('Diet_Plan_Arabic.docx');
      });
    });
  });

  it('should click the camera icon and upload My First Test -- verify test - (failed).png', () => {
    cy.get('svg.camera-icon').click({ force: true });
    cy.fixture('My First Test -- verify test - (failed).png', 'base64').then(fileContent => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/png');
      const testFile = new File([blob], 'My First Test -- verify test - (failed).png', { type: 'image/png' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      cy.get('input[type="file"]').then(input => {
        const el = input[0];
        el.files = dataTransfer.files;
        input.trigger('change', { force: true });
      });
    });
  });
});
describe('Manage Interests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); 
    
  });

  it('should add and delete an interest', () => {
    // Click on the button to open the modal
    cy.get('.add-interests-button').click();

    // Click on the "Add Interest" button inside the modal
    cy.get('#add-interest').click();

    // Type the interest name in the first input field (interest input 0)
    cy.get('#interest-input-0').type('Programming');

    // Click the "Save All" button to submit the form
    cy.get('#submit-all').click();

    // Verify the interest was added (this assumes the interest is displayed in a list)
    cy.contains('Programming').should('exist');

    // Now delete the interest by clicking the delete button
    cy.get('div[class="interests-list"] div button').first().click();

    // Verify the interest has been removed (optional, if the UI updates accordingly)
    cy.contains('Programming').should('not.exist');
  });
});
