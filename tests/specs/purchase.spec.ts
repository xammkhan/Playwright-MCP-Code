import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { credentials } from '../utils/helper';

const selectedProducts = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

test.describe('Complete Purchase Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await inventoryPage.expectInventoryPage();
  });

  test('should complete order successfully', async ({ page }) => {
    await inventoryPage.addProductsByName(selectedProducts);
    await test.step('validate cart badge count', async () => {
      const count = await inventoryPage.getCartBadgeCount();
      await expect(count).toBe(selectedProducts.length);
    });

    await inventoryPage.openCart();
    await cartPage.expectCartPage();
    await cartPage.validateItems(selectedProducts);
    await cartPage.proceedToCheckout();
    await checkoutPage.expectCheckoutInformationPage();
    await checkoutPage.fillCheckoutInformation(
      credentials.firstName,
      credentials.lastName,
      credentials.postalCode,
    );
    await checkoutPage.expectOverviewPage();
    await checkoutPage.finishCheckout();
    await checkoutPage.expectSuccessMessage();
  });
});
