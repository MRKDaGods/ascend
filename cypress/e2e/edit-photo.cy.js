describe('Upload Photo and Resume Feature', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Adjust to your app's local URL
    });
  
    it('should upload a profile photo and a resume file', () => {
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
  
      // Optional: check if image was uploaded successfully
      // cy.get('.image-preview').should('be.visible');
  
      // === STEP 2: Upload Resume ===
      // Scroll to upload button and click it forcefully if hidden
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
  
      // Optional: assert success message or confirmation if UI displays one
      // cy.contains('Resume uploaded!').should('exist');
    });
  
    // === NEW IT BLOCK TO CLICK CAMERA ICON ===
    it('should click the camera icon and upload My First Test -- verify test - (failed).png', () => {
      // === CLICK CAMERA ICON ===
      cy.get('svg.camera-icon') // Locate the camera icon using its class
        .click({ force: true });  // Click the camera icon
  
      // === UPLOAD IMAGE ===
      cy.fixture('My First Test -- verify test - (failed).png', 'base64').then(fileContent => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/png');
        const testFile = new File([blob], 'My First Test -- verify test - (failed).png', { type: 'image/png' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
  
        // Trigger the file input to upload the image
        cy.get('input[type="file"]')  // Locate the file input
          .then(input => {
            const el = input[0];
            el.files = dataTransfer.files;  // Set the file to be uploaded
            input.trigger('change', { force: true });  // Trigger the change event to simulate the file upload
          });
      });
    });
  });
  