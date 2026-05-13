import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  private page: Page;
  readonly cartTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectCartPage() {
    await expect(this.page).toHaveURL(/cart.html/);
    await expect(this.cartTitle).toHaveText('Your Cart');
  }

  async validateItems(names: string[]) {
    const itemCount = await this.cartItems.count();
    await expect(itemCount).toBe(names.length);

    for (const name of names) {
      await expect(this.cartItems.filter({ hasText: name })).toHaveCount(1);
    }
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
