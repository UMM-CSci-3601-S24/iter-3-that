import { HunterViewPage } from "cypress/support/hunter-view.po";

const page = new HunterViewPage();

describe('Hunter View', () => {
  beforeEach(() => page.navigateTo());

  /**
   * These test will get to the hunt, begin it and capture the access code.
   * Then it will navigate to the hunter view page with the access code.
   */

  it('should navigate to the right hunter view page with the captured access code', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunter-view/${accessCode}`);
    });
  });

  it('should display the hunt title as hunter-view', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    })

    page.getTeamNameField().type('Team 1');
    page.getTeamMembersField().type('John', {force: true});
    page.clickCreateTeamButton();

    page.getHunterViewTitle().contains('You are in');
  });

  it('should display the hunt tasks list in Your Task column', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    })

    page.getTeamNameField().type('Team 1');
    page.getTeamMembersField().type('John', {force: true});
    page.clickCreateTeamButton();

    // navigate to the hunter view page with access code.

    page.getHuntTaskList().should('exist');
  });

  it('should display the upload picture button and the picture input field', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    })

    page.getTeamNameField().type('Team 1');
    page.getTeamMembersField().type('John', {force: true});
    page.clickCreateTeamButton();

//     // navigate to the hunter view page with access code.

    page.getHuntTaskList().should('exist');
  });

  it('should display the upload picture button and the picture input field', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    })

    page.getTeamNameField().type('Team 1');
    page.getTeamMembersField().type('John', {force: true});
    page.clickCreateTeamButton();

//     // navigate to the hunter view page with access code.

    page.getHuntTaskList().should('exist');
  });

  it('should display the take picture button and the picture input field', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    })

    page.getTeamNameField().type('Team 1');
    page.getTeamMembersField().type('John', {force: true});
    page.clickCreateTeamButton();

  // navigate to the hunter view page with access code.

    page.getTakePictureButton().should('exist');
  });

  it('should click the take picture button', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

    cy.get('@accessCode').then((accessCode) => {
      cy.visit(`/hunters/`);
      for (let i = 0; i < accessCode.length; i++) {
        page.getAccessCodeInput(i + 1).type(accessCode.toString().charAt(i));
      }
    }).then(() => {
      cy.wait(1000);
      page.clickJoinHuntButton();
    })

    page.getTeamNameField().type('Team 1');
    page.getTeamMembersField().type('John', {force: true});
    page.clickCreateTeamButton();

    // navigate to the hunter view page with access code.

    page.getTakePictureButton().first().click();
  });

  it('should have the capture image button and X ( cancel capture ) button', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

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

    // navigate to the hunter view page with access code.

    page.getTakePictureButton().first().click();
    page.getCaptureImageButton().should('exist');
    page.getCancelCaptureButton().should('exist');
  });

  it('should click the capture image button, photo being uploaded successfully', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

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

    // navigate to the hunter view page with access code.

    page.getTakePictureButton().first().click();
    page.getCaptureImageButton().should('exist');
    page.clickCaptureImageButton();
    page.getSnackBar().contains('Photo uploaded successfully');
  });

  it('should capture image, replaced it successfully', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

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

    // navigate to the hunter view page with access code.

    page.getTakePictureButton().first().click();
    page.getCaptureImageButton().should('exist');
    page.clickCaptureImageButton();
    page.getSnackBar().contains('Photo uploaded successfully');

    page.getTakePictureButton().first().click();
    page.clickCaptureImageButton();
    page.getSnackBar().contains('Photo replaced successfully');
  });

  it('should cancel capture image when click the overlay', () => {
    page.getHostButton().click();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

    cy.get('mat-form-field [formcontrolname=numTeam]').type('2', {force: true});
    page.clickBeginHunt();
    cy.wait(2000);
    page.getAccessCode();

    // Those above will navigate to the Hunt, begin it
    // and capture the access code.

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

    // navigate to the hunter view page with access code.

    page.getTakePictureButton().first().click();
    page.getCancelOverlay().click({force: true});
  });

});
