describe('Jobs & Hiring', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/jobs'); // Adjust for localhost
    });
  
    it('should search for jobs by keyword', () => {
      cy.get('#job-search-bar').type('Software Engineer');
      cy.get('button.search').click();
      cy.get('.job-listing').should('contain', 'Software Engineer');
    });
  
    it('should filter jobs by experience level, company, and salary range', () => {
      cy.get('#filter-experience').select('Mid Level');
      cy.get('#filter-company').type('Google');
      cy.get('#filter-salary').type('5000');
      cy.get('button.apply-filters').click();
      cy.get('.job-listing').should('contain', 'Google');
    });
  
    it('should save a job for later', () => {
      cy.get('.job-listing').first().find('button.save-job').click();
      cy.get('.success-message').should('contain', 'Job saved');
      cy.visit('/saved-jobs');
      cy.get('.job-listing').should('be.visible');
    });
  
    it('should apply for a job', () => {
      cy.get('.job-listing').first().find('button.apply-now').click();
      cy.get('.success-message').should('contain', 'Application submitted');
    });
  
    it('should view application status', () => {
      cy.visit('/applications');
      cy.get('.application-status').should('be.visible');
      cy.get('.application-status').should('contain', 'Pending')
                                  .or('contain', 'Viewed')
                                  .or('contain', 'Rejected')
                                  .or('contain', 'Accepted');
    });
  
    it('should allow employers to post job listings', () => {
      cy.visit('/employer-dashboard');
      cy.get('#job-title').type('Software Engineer');
      cy.get('#job-description').type('We are hiring a Software Engineer.');
      cy.get('#job-requirements').type('3+ years of experience.');
      cy.get('button.post-job').click();
      cy.get('.success-message').should('contain', 'Job posted successfully');
    });
  
    //it('should allow employee to review applications', () => {
     // cy.visit('/employer-dashboard/applications');
      //cy.get('.application').first().should('be.visible');
     // cy.get('.application').first().find('button.view-details').click();
     // cy.get('.application-details').should('be.visible');
    });
  
   // it('should allow employee to contact candidates', () => {
     // cy.visit('/employer-dashboard/applications');
      //cy.get('.application').first().find('button.contact-candidate').click();
      //cy.get('.success-message').should('contain', 'Message sent');
    })
  });