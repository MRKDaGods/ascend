describe('Complete Profile Setup Flow', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Adjust to your app's local URL
    });
  
    it('should upload a profile photo, upload a resume, add education, and save skills', () => {
  
      // === STEP 1: Upload Profile Photo ===
      cy.get('.profile-picture-container').click();
      cy.get('button.modal-button').contains('Edit').click();
  
      // Read the image from fixtures and create a File object
      cy.fixture('My First Test -- verify test - (failed).png', 'base64').then(fileContent => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/png');
        const testFile = new File([blob], 'My First Test -- verify test - (failed).png', { type: 'image/png' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
  
        // Upload file via native input
        cy.get('input[type="file"]').first().then(input => {
          const el = input[0];
          el.files = dataTransfer.files;
          input.trigger('change', { force: true });
        });
      });
  
      // === STEP 2: Upload Resume ===
      cy.get('button.upload-resume-button')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
  
      // Read the resume file and create a File object
      cy.fixture('Diet_Plan_Arabic.docx', 'base64').then(fileContent => {
        const blob = Cypress.Blob.base64StringToBlob(
          fileContent,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
        const testFile = new File([blob], 'Diet_Plan_Arabic.docx', {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
  
        // Upload resume via second file input (adjust if needed)
        cy.get('input[type="file"]').last().then(input => {
          const el = input[0];
          el.files = dataTransfer.files;
          input.trigger('change', { force: true });
        });
  
        // Confirm the correct file was uploaded via input value
        cy.get('input[type="file"]').last().should($input => {
          expect($input[0].files[0].name).to.equal('Diet_Plan_Arabic.docx');
        });
      });
  
      // === STEP 3: Add Education ===
      cy.get('button.add-education-button')
        .should('be.visible')
        .click({ force: true });
  
      cy.get('input[name="school"]')
        .should('be.visible')
        .type('Cairo University');
  
      cy.get('input[name="degree"]')
        .should('be.visible')
        .type('Bachelor\'s in Engineering');
  
      cy.get('input[name="field_of_study"]')
        .should('be.visible')
        .type('Computer Science');
  
      cy.get('input[name="start_date"]')
        .should('be.visible')
        .type('2022-01-01');
  
      cy.get('input[name="end_date"]')
        .should('be.visible')
        .type('2024-12-31');
  
      cy.get('textarea[name="description"]')
        .should('be.visible')
        .type('Studied computer science and engineering focusing on algorithms and AI.');
  
      cy.contains('button', 'Save')
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true });
  
      // === STEP 4: Add Skills ===
      cy.get('button.add-skills-button')
        .should('be.visible')
        .click({ force: true });
  
      cy.contains('button', 'Add Skill')
        .should('be.visible')
        .click({ force: true });
  
      cy.get('input[placeholder="Skill name"]')
        .should('be.visible')
        .type('JavaScript');
  
      cy.contains('button', 'Save All')
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true });
  
      // === STEP 5: Optional Verification ===
      cy.contains('Cairo University').should('exist');
      cy.contains('Bachelor\'s in Engineering').should('exist');
      cy.contains('JavaScript').should('exist');
      
      // Optional: Assert the profile photo and resume are uploaded successfully
      cy.get('.image-preview').should('be.visible');
      cy.contains('Resume uploaded!').should('exist');
    });
  });
  