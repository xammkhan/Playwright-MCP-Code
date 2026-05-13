import { expect, Locator, Page } from '@playwright/test';

export class CheckoutPage {
  private page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly overviewTitle: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.overviewTitle = page.locator('.title');
    this.successMessage = page.locator('.complete-header');
  }

  async expectCheckoutInformationPage() {
    await expect(this.page).toHaveURL(/checkout-step-one.html/);
    await expect(this.overviewTitle).toHaveText('Checkout: Your Information');
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async expectOverviewPage() {
    await expect(this.page).toHaveURL(/checkout-step-two.html/);
    await expect(this.overviewTitle).toHaveText('Checkout: Overview');
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async expectSuccessMessage() {
    await expect(this.page).toHaveURL(/checkout-complete.html/);
    await expect(this.successMessage).toHaveText('Thank you for your order!');
  }
}
