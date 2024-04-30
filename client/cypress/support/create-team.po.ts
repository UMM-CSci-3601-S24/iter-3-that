export class CreateTeamPage {
  private readonly baseUrl = '/';
  private readonly huntTitle = '.hunt-title';
  private readonly huntNofTasks = '.hunt-Nof-tasks';
  private readonly huntTimer = '.hunt-timer';
  private readonly huntTaskList = '.task-list';
  private readonly HunterButton = '[name="hunter-button"]';
  private readonly HostButton = '[name="host-button"]';
  private readonly hostCardSelector = '.hunt-cards-container app-hunt-card';
  private readonly profileButtonSelector = '[data-test=viewProfileButton]';
  private readonly beginHuntButton = '.begin-hunt';
  private readonly huntAccessCode = '.access-code-number';
  private readonly takePictureButton = '.take-picture';
  private readonly joinHuntButtonSelector = '[name="join-button"]';
  private readonly captureImageButton = '.capture-image-button';
  private readonly cancelCaptureImageButton = '.cancel-capture-button';
  private readonly snackBar = '.mat-mdc-snack-bar-label.mdc-snackbar__label';
  private readonly cancelOverlay = '.overlay';
  private readonly teamNameField = '.test-team-name-input';
  private readonly teamMembersField = '.team-member-input';
  private readonly createTeamButton = '.submit-button';
  private readonly cancelCreateTeamButton = '.cancel-button';
  private readonly createTeamTitle = '.add-team-title';
  private readonly addingMembersButton = '.add-member';
  private readonly removeMembersButton = '.remove-member';
  private readonly joinHuntPageTitle = '.title';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  /**
   * Get the title of the hunter view page.
   *
   * @return the value of the element with the ID `.hunt-title`
   */
  getHunterViewTitle() {
    return cy.get(this.huntTitle);
  }

  /**
   * Get the hunter button DOM element.
   *
   * @return the value of the element with the ID `[name="hunter-button"]`
   */
  getHunterButton() {
    return cy.get(this.HunterButton);
  }

  /**
   * Get the host button DOM element.
   *
   * @return the value of the element with the ID `[name="host-button"]`
   */
  getHostButton() {
    return cy.get(this.HostButton);
  }

  /**
   * Get all the `app-host-card` DOM elements. This will be
   * empty if we're using the list view of the hosts.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `app-host-card` DOM elements.
   */
  getHuntCards() {
    return cy.get(this.hostCardSelector);
  }

  /**
   * Clicks the "view profile" button for the given host card.
   * Requires being in the "card" view.
   *
   * @param card The host card
   */
  clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>(this.profileButtonSelector).click();
  }

  /**
   * Clicks the "begin hunt" button in the hunt page.
   * Requires being in the "hunt" view as hosts.
   *
   * @returns the value of the element with the ID `.begin-hunt`
   */
  clickBeginHunt() {
    return cy.get(this.beginHuntButton).click();
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
   * Get the number of tasks of the hunt as hunter-view.
   *
   * @returns the value of the element with the class `.hunt`
   */
  getHuntNofTasks() {
    return cy.get(this.huntNofTasks);
  }

  /**
   * Get the number of tasks of the hunt as hunter-view.
   *
   * @returns the value of the element with the class `.hunt`
   */
  getHuntTimer() {
    return cy.get(this.huntTimer);
  }

  /**
   * Get the task list of the hunt as hunter-view.
   *
   * @return the value of the element with the class `.task-list`
   */
  getHuntTaskList() {
    return cy.get(this.huntTaskList);
  }

  /**
   * Get the take picture button.
   *
   * @returns the value of the element.
   */
  getTakePictureButton() {
    return cy.get(this.takePictureButton);
  }

  /**
   * Get the position of the box in the access input field.
   *
   * @param index
   * @returns
   */
  getAccessCodeInput(index: number) {
    return cy.get(`.input-container input:nth-child(${index})`);
  }

  /**
   * Click the join-hunt button DOM element.
   *
   * @returns the value of the element with the class.
   */
  clickJoinHuntButton() {
    return cy.get(this.joinHuntButtonSelector).click();
  }

  /**
   * Get the capture image button DOM element.
   *
   * @returns the value of the element with the class.
   */
  getCaptureImageButton() {
    return cy.get(this.captureImageButton);
  }

  /**
   * Click the capture image button DOM element.
   *
   * @return the value of the element with the class.
   */
  clickCaptureImageButton() {
    return cy.get(this.captureImageButton).click();
  }

  /**
   * Get the cancel capture image button DOM element.
   *
   * @returns the value of the element with the class.
   */
  getCancelCaptureButton() {
    return cy.get(this.cancelCaptureImageButton);
  }

  /**
   * Click the cancel capture image button DOM element.
   *
   * @returns the value of the element with the class.
   */
  clickCancelCaptureButton() {
    return cy.get(this.cancelCaptureImageButton).click();
  }

  /**
   * Get the snack bar DOM element.
   *
   * @returns the value of the element with the class.
   */
  getSnackBar() {
    cy.wait(500);
    return cy.get(this.snackBar);
  }

  /**
   * Get the cancel overlay DOM element.
   *
   * @returns the value of the element with the class.
   */
  getCancelOverlay() {
    return cy.get(this.cancelOverlay);
  }

  /**
   * Get the team field DOM element.
   *
   * @returns the value of the element with the class.
   */
  getTeamNameField() {
    return cy.get(this.teamNameField);
  }

  /**
   * Get the team members field DOM element.
   *
   * @returns the value of the element with the class.
   */
  getTeamMembersField() {
    return cy.get(this.teamMembersField);
  }

  /**
   * Click the create team button DOM element.
   *
   * @returns the value of the element with the class.
   */
  clickCreateTeamButton() {
    return cy.get(this.createTeamButton).click();
  }

  /**
   * Click the cancel create team button DOM element.
   *
   * @returns the value of the element with the class.
   */
  clickCancelCreateTeamButton() {
    return cy.get(this.cancelCreateTeamButton).click();
  }

  /**
   * Get the create team title DOM element.
   *
   * @returns the value of the element with the class.
   */
  getCreateTeamTitle() {
    return cy.get(this.createTeamTitle);
  }

  /**
   * Get the create team button DOM element.
   *
   * @returns the value of the element with the class.
   */
  getCreateTeamButton() {
    return cy.get(this.createTeamButton);
  }

  /**
   * Get the add member button DOM element.
   *
   * @returns the value of the element with the class.
   */
  getAddingMembersButton() {
    return cy.get(this.addingMembersButton);
  }

  /**
   * Get the remove member button DOM element.
   *
   * @returns the value of the element with the class.
   */
  getRemoveMembersButton() {
    return cy.get(this.removeMembersButton);
  }

  /**
   * Get the cancel create team button DOM element.
   *
   * @returns the value of the element with the class.
   */
  getCancelCreateTeamButton() {
    return cy.get(this.cancelCreateTeamButton);
  }

  /**
   * Gets the title of the app when visiting the `/join-hunt` page.
   *
   * @returns the value of the element with the ID `.join-hunt-title`
   */
  getJoinHuntTitle() {
    return cy.get(this.joinHuntPageTitle);
  }
}
