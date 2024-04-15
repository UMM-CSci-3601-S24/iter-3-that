import { AppPage } from '../support/app.po';

const page = new AppPage();

describe('App', () => {
  beforeEach(() => page.navigateTo());

  it('should display welcome message', () => {
    page.getAppTitle().should('contain', 'Scav-a-Snap');
  });

  it('should navigate to host and back', () => {
    cy.get('[name=host-button]').click();
    cy.url().should('include', '/host');
    cy.get('[name=home-button]').click();
  });

  it('should navigate to join hunt page by clicking Hunter and back', () => {
    cy.get('[name=hunter-button]').click();
    cy.url().should('include', '/hunter');
    cy.get('[name=home-button]').click();
  })
});
