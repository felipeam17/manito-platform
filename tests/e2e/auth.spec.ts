import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Click login button
    await page.getByRole('link', { name: /Iniciar Sesión/i }).click();
    
    // Should navigate to login page
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    
    // Click register button
    await page.getByRole('link', { name: /Registrarse/i }).click();
    
    // Should navigate to register page
    await expect(page).toHaveURL(/.*auth\/register/);
  });

  test('should display login form elements', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check if login form elements are present
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('should display register form elements', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Check if register form elements are present
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /registrarse/i })).toBeVisible();
  });
});
