import { BeginHuntPage } from "cypress/support/begin-hunt.po";

const page = new BeginHuntPage();

describe('Begin Hunt', () => {
  beforeEach(() => {
    page.navigateTo();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
    });
    cy.task('seed:database');
  });

  it('should click the begin hunt and navigate to the right access code page', () => {
    page.getNumTeamField().type('2', {force: true});
    page.beginHuntButton().should('exist');
    page.beginHuntButton().click();
    cy.wait(2000);
    page.getAccessCode().then((accessCode) => {
      cy.wait(2000);
      cy.url().should('eq', `http://localhost:4200/startedHunts/${accessCode}`);
    });
  });

  it('should click the Begin Hunt button again to start the hunt', () => {
    page.getNumTeamField().type('2', {force: true});
    page.beginHuntButton().should('exist');
    page.beginHuntButton().click();
    cy.wait(2000);
    page.getAccessCode().then((accessCode) => {
      cy.wait(1000);
      cy.url().should('eq', `http://localhost:4200/startedHunts/${accessCode}`);
    });
    page.clickSecondBeginHuntButton();
  });

  it('should start hunt with the correct hunt information/end hunt page', () => {
    page.getNumTeamField().type('2', {force: true});
    page.beginHuntButton().should('exist');
    page.beginHuntButton().click();
    cy.wait(2000);
    page.getAccessCode().then((accessCode) => {
      cy.wait(1000);
      cy.url().should('eq', `http://localhost:4200/startedHunts/${accessCode}`);
    });
    page.clickSecondBeginHuntButton();

    page.getHuntTaskList().should('exist');
    page.getTableTaskTitle().should('exist');
    page.getProgressTeamTile().should('exist');
    page.getTeamCard().should('exist');
  });

  it('should click End Hunt, navigate to the Ended Hunt Details and show message', () => {
    page.getNumTeamField().type('2', {force: true});
    page.beginHuntButton().should('exist');
    page.beginHuntButton().click();
    cy.wait(2000);
      page.getAccessCode().then((accessCode) => {
      cy.wait(1000);
      cy.url().should('eq', `http://localhost:4200/startedHunts/${accessCode}`);
      });
      page.clickSecondBeginHuntButton();
      page.getTableTaskTitle().should('exist');
  })
});
