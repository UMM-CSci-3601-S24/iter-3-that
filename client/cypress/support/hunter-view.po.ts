export class HunterViewPage {
  private readonly baseUrl = '/';
  private readonly huntTitle = '.hunt-title';
  private readonly huntNofTasks = '.hunt-Nof-tasks';
  private readonly huntTimer = '.hunt-timer';
  private readonly huntTaskList = '.task-list';
  private readonly hunterUploadImage = '.image-upload';
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
   * Click the take picture button DOM element.
   *
   * @returns the value of the element.
   */
  clickTakePictureButton() {
    return cy.get(this.takePictureButton).first().click();
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
}
