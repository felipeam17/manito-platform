import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: /Encuentra el profesional/i })).toBeVisible();
  });

  test('should display service categories', async ({ page }) => {
    await page.goto('/');
    
    // Check if categories are displayed
    await expect(page.getByText('Plomería')).toBeVisible();
    await expect(page.getByText('Electricidad')).toBeVisible();
    await expect(page.getByText('Pintura')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    await expect(page.getByRole('link', { name: 'Servicios' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cómo funciona' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Para Profesionales' })).toBeVisible();
  });

  test('should have register and login buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check auth buttons
    await expect(page.getByRole('link', { name: /Iniciar Sesión/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Registrarse/i })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu button is visible
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
  });
});
