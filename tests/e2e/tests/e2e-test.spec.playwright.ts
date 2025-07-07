import { test, expect } from '@playwright/test'

test.describe('TaskTango E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://tasktango.vercel.app/')
    await expect(page).toHaveTitle('TaskTango - Home Page')
  })

  test('should load the homepage', async ({ page }) => {
    // Your test content here
    expect(page.url()).toContain('tasktango.vercel.app')
  })
})
