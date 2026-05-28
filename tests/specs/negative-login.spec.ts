import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const invalidUsername = 'invalid_user';
const invalidPassword = 'wrong_password';

const invalidCredentialsMessage =
  'Epic sadface: Username and password do not match any user in this service';
const emptyPasswordMessage = 'Epic sadface: Password is required';

test.describe('Negative login validation', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display error for invalid credentials', async () => {
    await loginPage.login(invalidUsername, invalidPassword);
    await loginPage.expectErrorMessage(invalidCredentialsMessage);
  });

  test('should display error when password is missing', async () => {
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.passwordInput.fill('');
    await loginPage.loginButton.click();
    await loginPage.expectErrorMessage(emptyPasswordMessage);
  });
});
