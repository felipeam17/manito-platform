import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should complete full registration flow for client', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Step 1: Basic Info
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="button"]:has-text("Siguiente")');
    
    // Step 2: Personal Info
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="phone"]', '+507 1234-5678');
    await page.click('button[type="button"]:has-text("Siguiente")');
    
    // Step 3: Account Type
    await page.check('input[value="CLIENT"]');
    await page.check('input[name="acceptTerms"]');
    await page.click('button[type="submit"]:has-text("Crear Cuenta")');
    
    // Should redirect to verification page
    await expect(page).toHaveURL(/.*auth\/verify/);
    await expect(page.getByText('Verifica tu Email')).toBeVisible();
  });

  test('should complete full registration flow for professional', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Step 1: Basic Info
    await page.fill('input[name="email"]', 'pro@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="button"]:has-text("Siguiente")');
    
    // Step 2: Personal Info
    await page.fill('input[name="name"]', 'Professional User');
    await page.fill('input[name="phone"]', '+507 8765-4321');
    await page.click('button[type="button"]:has-text("Siguiente")');
    
    // Step 3: Account Type
    await page.check('input[value="PRO"]');
    await page.check('input[name="acceptTerms"]');
    await page.click('button[type="submit"]:has-text("Crear Cuenta")');
    
    // Should redirect to verification page
    await expect(page).toHaveURL(/.*auth\/verify/);
    await expect(page.getByText('Verifica tu Email')).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Try to proceed without filling required fields
    await page.click('button[type="button"]:has-text("Siguiente")');
    
    // Should show validation errors
    await expect(page.getByText('Todos los campos son obligatorios')).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'different123');
    await page.click('button[type="button"]:has-text("Siguiente")');
    
    // Should show password mismatch error
    await expect(page.getByText('Las contraseñas no coinciden')).toBeVisible();
  });

  test('should show error for weak password', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    await page.click('button[type="button"]:has-text("Siguiente")');
    
    // Should show weak password error
    await expect(page.getByText('La contraseña debe tener al menos 6 caracteres')).toBeVisible();
  });

  test('should require terms acceptance', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Complete all steps but don't accept terms
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="button"]:has-text("Siguiente")');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="phone"]', '+507 1234-5678');
    await page.click('button[type="button"]:has-text("Siguiente")');
    
    await page.check('input[value="CLIENT"]');
    // Don't check terms
    await page.click('button[type="submit"]:has-text("Crear Cuenta")');
    
    // Should show terms error
    await expect(page.getByText('Debes aceptar los términos y condiciones')).toBeVisible();
  });
});
