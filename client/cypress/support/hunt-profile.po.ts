export class HuntProfilePage {
  private readonly baseUrl = '/hosts';
  private readonly huntCardSelector = '.hunt-card';
  private readonly profileButtonSelector = '[data-test=viewProfileButton]';
  private readonly taskSelector = '.task-line';
  private readonly hostCardSelector = '.hunt-cards-container app-hunt-card';
  private readonly formFieldSelector = `mat-form-field`;
  private readonly button = '[data-test=addTaskButton]';
  private readonly ReturnToHuntButton = '.return-to-hunts';
  private readonly BeginHuntButton = '.begin-hunt';
  private readonly huntAccessCode = '.access-code-number';
  private readonly HomeButton = '[name="home-button"]';
  private readonly huntDescription = '.hunt-card-description';
  private readonly huntName = '.hunt-card-name'

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

   getHuntCard() {
    return cy.get(this.huntCardSelector);
  }

  getHuntCards() {
    return cy.get(this.hostCardSelector);
  }

  getTasks() {
    return cy.get(this.taskSelector);
  }

  deleteHunt() {
    return cy.get('[data-test=removeHuntButton]').click();
  }

  deleteTask() {
    return cy.get('[data-test=removeTaskButton]').first().click();
  }

  addTaskButton() {
    return cy.get(this.button);
  }

  confirmAddTaskButton() {
    return cy.get('[data-test=confirmAddTaskButton]');
  }

  getFormField(fieldName: string) {
    return cy.get(`${this.formFieldSelector} [formcontrolname=${fieldName}]`);
  }

  clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>(this.profileButtonSelector).click();
  }

  /**
   * @returns The hunt card title
   */
  getHuntCardTitle() {
    return cy.get(this.huntName);
  }

  /**
   * @returns The hunt card description
   */
  getHuntCardDescription() {
    return cy.get(this.huntDescription);
  }

  /**
   * @returns The return to hunts button
   */
  getHuntCardReturnToHuntsButton() {
    return cy.get(this.ReturnToHuntButton);
  }

  /**
   * @returns The begin hunt button
   */
  getHuntCardBeginHuntButton() {
    return cy.get(this.BeginHuntButton);
  }

  /**
   * Get the access code from the started Hunt.
   * Requires begin Hunt in the "hunt" view as hosts.
   *
   * @returns the value of the element with the class `.col-md-12 Access Code`
   */
  getAccessCode() {
    return cy.get(this.huntAccessCode).invoke('text').as('accessCode');
  }

  /**
   * @returns The home button
   */
  getHomeButton() {
    return cy.get(this.HomeButton);
  }
}
