import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { credentials } from '../utils/helper';

test.describe('Login Validation', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('should login and logout successfully', async ({ page }) => {
    await loginPage.login(credentials.username, credentials.password);
    await inventoryPage.expectInventoryPage();
    await inventoryPage.verifyProductsVisible();
    await inventoryPage.logout();
    await loginPage.expectLoginScreen();
  });
});
