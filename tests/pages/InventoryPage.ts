import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
  private page: Page;
  readonly inventoryTitle: Locator;
  readonly productItems: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryTitle = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async expectInventoryPage() {
    await expect(this.page).toHaveURL(/inventory.html/);
    await expect(this.inventoryTitle).toHaveText('Products');
  }

  async verifyProductsVisible() {
    const productCount = await this.productItems.count();
    await expect(productCount).toBeGreaterThan(0);
  }

  async addProductsByName(names: string[]) {
    for (const itemName of names) {
      const product = this.page.locator('.inventory_item').filter({ hasText: itemName });
      await expect(product).toHaveCount(1);
      await product.locator('button').click();
    }
  }

  async getCartBadgeCount() {
    if (await this.cartBadge.count() === 0) return 0;
    const text = await this.cartBadge.textContent();
    return text ? Number(text.trim()) : 0;
  }

  async openCart() {
    await this.cartIcon.click();
  }

  async logout() {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }
}
