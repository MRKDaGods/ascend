describe('Login and Sign Up Page Tests', () => {

  // Before each test, visit the login page
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('should sign up a new user and log in with valid credentials', () => {
    // Step 1: Click the Sign Up link
    cy.get('a[href="/signup"]')  // Select the Sign Up link by href attribute
      .should('be.visible')        // Ensure the link is visible
      .click();                    // Click the Sign Up link

    // Step 2: Fill in the sign-up form
    cy.get('input[name="firstName"]')  // Select the first name input by name attribute
      .should('be.visible')             // Ensure the field is visible
      .type('John');                    // Type the first name

    cy.get('input[name="lastName"]')  // Select the last name input by name attribute
      .should('be.visible')             // Ensure the field is visible
      .type('Doe');                     // Type the last name

    cy.get('input[name="email"]')  // Select the email input by name attribute
      .should('be.visible')             // Ensure the field is visible
      .type('johndoe@example.com');    // Type a sample email

    cy.get('input[name="password"]')  // Select the password input by name attribute
      .should('be.visible')             // Ensure the field is visible
      .type('Password123');             // Type the password

    cy.get('input[name="confirmPassword"]')  // Select the confirm password input by name attribute
      .should('be.visible')                    // Ensure the field is visible
      .type('Password123');                    // Type the confirm password

    cy.get('input[name="termsAccepted"]')  // Ensure terms accepted checkbox is visible
      .check();                             // Check the checkbox

    cy.get('select[name="role"]')  // Select the role dropdown by name attribute
      .select('doctor');            // Choose the role (Doctor)

    cy.get('input[name="birthdate"]')  // Select the birthdate input by name attribute
      .should('be.visible')             // Ensure the field is visible
      .type('1990-01-01');              // Type the birthdate

    // Step 3: Submit the Sign Up form
    cy.get('button.sign-up-button')  // Select the Sign-Up button by class name
      .should('be.visible')           // Ensure the button is visible
      .click();                       // Click the Sign-Up button

    // Step 4: After successful sign-up, navigate back to the login page
    cy.url().should('include', '/login');  // Verify that after signing up, we're redirected to the login page

    // Step 5: Log in with the newly created account
    cy.get('input[placeholder="ID"]')  // Select the ID input field
      .should('be.visible')             // Ensure the field is visible
      .type('johndoe@example.com')      // Type the email address as ID
      .should('have.value', 'johndoe@example.com');  // Assert the value entered

    cy.get('input[placeholder="Password"]')  // Select the password input field
      .should('be.visible')                   // Ensure the field is visible
      .type('Password123')                    // Type the password
      .should('have.value', 'Password123');   // Assert the value entered

    // Click the login button to submit the form
    cy.get('button._loginButton_v1niz_95')  // Select the login button by class name
      .should('be.visible')                  // Ensure the button is visible
      .click();                              // Click the login button

    // After login, we should be redirected to the dashboard or home page
    cy.url().should('include', '/dashboard');  // Example assertion (change to the actual redirect page after login)
  });

});