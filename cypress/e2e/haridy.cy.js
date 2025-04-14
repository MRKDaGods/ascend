describe('Add and Delete Experience Flow', () => {

    it('should add experience', () => {
      cy.visit('http://localhost:3000');
      it('should delete experience', () => {
        // Wait for the experience section to load
        cy.wait(500);
    
        // Delete the experience (first delete button in the experience section)
        cy.get("div[class='experience-section'] div button").first().click();
      });

      // Open Experience Modal
      cy.get("div[class='experience-section'] button").click();
  
      // Click "Add Experience" inside modal
      cy.get("body > div:nth-child(1) > div:nth-child(2) > div:nth-child(9) > div:nth-child(1) > form:nth-child(2) > button:nth-child(1)").click();
  
      // Job Title
      cy.get("body > div:nth-child(1) > div:nth-child(2) > div:nth-child(9) > div:nth-child(1) > form:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)")
        .type('Frontend Developer');
  
      // Company Name
      cy.get("body > div:nth-child(1) > div:nth-child(2) > div:nth-child(9) > div:nth-child(1) > form:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > input:nth-child(2)")
        .type('TechCorp');
  
      // Description
      cy.get("div[class='linkedin-profile'] div div form div div div textarea")
        .type('Worked on building UI components using React and TailwindCSS.');
  
      // Wait before entering dates
      cy.wait(500); // Wait for the UI to stabilize
  
      // Start Date
      cy.get("input[type='date']").eq(0).clear().type('2024-01-01');
  
      // End Date
      cy.get("input[type='date']").eq(1).clear().type('2025-04-01');
  
      // Submit experience
      cy.get("body > div:nth-child(1) > div:nth-child(2) > div:nth-child(9) > div:nth-child(1) > form:nth-child(2) > button:nth-child(3)").click();
  
      // ✅ OPTIONAL: wait for the new experience to appear
      cy.wait(1000);
    });
  

  });
  