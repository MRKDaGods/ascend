describe('Company Pages', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/companies'); // Adjust for localhost
    });
  
    it('should create a company profile', () => {
      cy.visit('/create-company');
      cy.get('#company-name').type('Tech Corp');
      cy.get('#company-description').type('A leading tech company.');
      cy.get('#company-industry').select('Technology');
      cy.get('#company-location').type('Cairo, Egypt');
      cy.get('button.create-company').click();
      cy.get('.success-message').should('contain', 'Company profile created');
    });
  
    it('should update company details', () => {
      cy.visit('/company/tech-corp/edit');
      cy.get('#company-description').clear().type('An innovative tech leader.');
      cy.get('button.save-changes').click();
      cy.get('.success-message').should('contain', 'Company details updated');
    });
  
    it('should upload a company logo', () => {
      cy.visit('/company/tech-corp/edit');
      cy.get('#company-logo-upload').attachFile('logo.png');
      cy.get('button.upload-logo').click();
      cy.get('.success-message').should('contain', 'Logo uploaded');
    });
  
    it('should post a job opening', () => {
      cy.visit('/company/tech-corp');
      cy.get('button.post-job').click();
      cy.get('#job-title').type('Software Developer');
      cy.get('#job-description').type('We are looking for a skilled developer.');
      cy.get('button.submit-job').click();
      cy.get('.success-message').should('contain', 'Job posted');
    });
  
    it('should post an update or announcement', () => {
      cy.visit('/company/tech-corp');
      cy.get('#update-textarea').type('We just launched a new product!');
      cy.get('button.post-update').click();
      cy.get('.success-message').should('contain', 'Update posted');
    });
  
    it('should manage company followers', () => {
      cy.visit('/company/tech-corp/followers');
      cy.get('.follower-list').should('be.visible');
    });
  
    it('should track job applications and analytics', () => {
      cy.visit('/company/tech-corp/dashboard');
      cy.get('.analytics-overview').should('be.visible');
      cy.get('.job-applications').should('be.visible');
    });
  });