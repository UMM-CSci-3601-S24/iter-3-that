import { CreateTeamPage } from "cypress/support/create-team.po";

const page = new CreateTeamPage();

describe('Hunter View', () => {
  beforeEach(() => page.navigateTo());

  /**
   * These test will get to the hunt, begin it and capture the access code.
   * Then it will navigate to the create team page with the access code.
   */

  it('should navigate to the create team page with the captured access code', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    });

    page.getTeamNameField().type('Team 1');
    page.getTeamMembersField().type('John', {force: true});
    page.clickCreateTeamButton();

    page.getHunterViewTitle().contains('You are in');

  });

  it('should display create team page title', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    });

    page.getCreateTeamTitle().contains('Create Team');

  });

  it('should display the team name field', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    });

    page.getTeamNameField().should('exist');

  });

  it('should display the team members field', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    });

    page.getTeamMembersField().should('exist');

  });

  it('should display the create team button', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    });

    page.getCreateTeamButton().should('exist');

  });

  it('should display the adding team member button', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    });

    page.getAddingMembersButton().should('exist');

  });

  it('should display the remove team member button', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    });

    page.getRemoveMembersButton().should('exist');

  });

  it('should display the cancel create team button', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    });

    page.getCancelCreateTeamButton().should('exist');

  });
});
