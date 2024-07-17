beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})
import { faker } from "@faker-js/faker";
/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */
describe('Visual tests created by Raiki Kalda', () => {
    it('Check that Cerebrum Hub logo is correct and has correct size', () => {
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        cy.get('[data-testid="picture"]').invoke('height')
            .should('be.lessThan', 178)
            .and('be.greaterThan', 100)   
    })

    it('Check that radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'Never')

        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        cy.get('input[type="radio"]').eq(2).check().should('be.checked')
        cy.get('input[type="radio"]').eq(3).check().should('be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
    })

    it('Check that list of cities is dependant of the choice of country', () => {
        cy.get('#country').select('Spain')
        cy.get('#city').find('option').then(($options) => {
            const expectedCities = ['','Malaga', 'Madrid', 'Valencia','Corralejo']; 
            expect($options.get().map((option) => option.text)).to.deep.equal(expectedCities)
            })

    cy.get('#country').select('Estonia')
        cy.get('#city').find('option').then(($options) => {
            const expectedCities = ['','Tallinn', 'Haapsalu', 'Tartu']; 
            expect($options.get().map((option) => option.text)).to.deep.equal(expectedCities)
            })
    
    cy.get('#country').select('Austria')
        cy.get('#city').find('option').then(($options) => {
            const expectedCities = ['','Vienna', 'Salzburg', 'Innsbruck']; 
            expect($options.get().map((option) => option.text)).to.deep.equal(expectedCities)
            })
    })

    it('Check if city is already chosen and country is updated, then city choice should be removed', () => {
        cy.get('#country').select('Estonia')
        cy.get('#city').select('Tartu')
        cy.get('#country').select('Spain')
        cy.get('#city').should('not.have.value')
    })

    it('Check checkboxes, their content and links', () => {
        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')
        cy.get('form').should('contain', 'Accept our privacy policy')
        cy.get('input[type="checkbox"]').next().should('contain','Accept our cookie policy')
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('button').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'cookiePolicy.html')
            .click()
        cy.url().should('contain', '/cookiePolicy.html')
        cy.go('back')
    })

    it('Email input should support correct pattern', () => {
           cy.get('.email').should('have.attr', 'type').should('contain', 'email')
           cy.get('.email').type('valeEmail')
           cy.get('h2').click()
           cy.get('#emailAlert').should('contain','Invalid email address.')
    })
})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */
describe('Functional tests created by Raiki Kalda', () => {
    it('User can submit the forms when ALL fields are filled in', () => {
        cy.get('#name').type(faker.person.firstName())
        cy.get('.email').type(faker.internet.email())
        cy.get('#country').select('Estonia')
        cy.get('#city').select('Tartu')
        cy.get('label').contains('Date of registration').next().type('2024-07-01')
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('#birthday').type('1988-02-24')
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="submit"]').should('be.enabled')
        cy.get('input[type="submit"]').click()
        cy.get('h1').should('contain', 'Submission received')
    })

    it('User can submit the forms when ONLY mandatory fields are filled in', () => {
        cy.get('#name').type(faker.person.firstName())
        cy.get('.email').type(faker.internet.email())
        cy.get('#country').select('Estonia')
        cy.get('#city').select('Tartu')
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="submit"]').should('be.enabled')
        cy.get('input[type="submit"]').click()
        cy.get('h1').should('contain', 'Submission received')
    })

    it('User can not submit the form when email is not filled in', () => {
        inputValidData('kasutaja')
        cy.get('.email').clear()
        cy.get('input[type="submit"]').should('not.be.enabled')
        cy.get('span[ng-show="myForm.email.$error.required"]').should('contain', 'Email is required.')
    })

    it('User can not submit the form when City is not selected', () => {
        inputValidData('kasutaja')
        cy.get('#city').select(0)
        cy.get('input[type="submit"]').should('not.be.enabled')
    })

    it('Test add file functionality ', () => {
        cy.get('#myFile').selectFile('load_this_file_reg_form_3.txt')
    })
})


function inputValidData(kasutaja) {
    cy.get('#name').type(kasutaja)
    cy.get('.email').type('kasutaja@hot.ee')
    cy.get('#country').select('Estonia')
    cy.get('#city').select('Tartu')
    cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
    cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
}