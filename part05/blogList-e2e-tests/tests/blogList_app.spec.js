const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await page.goto('/')
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Sergej Gavrilov',
        username: 'sgavrilo',
        password: 'superSave',
      },
    })
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'sgavrilo', 'superSave')

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'new blog' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'sgavrilo', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'sgavrilo', 'superSave')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Test Blog',
        'Sergej Gavrilov',
        'github.com/Kopfdreher',
      )
      await expect(page.getByText('Test Blog by Sergej Gavrilov')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'another Test Blog',
          'Sergej Gavrilov',
          'github.com/Kopfdreher',
        )
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'another Test Blog by Sergej Gavrilov' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted by the user who added it', async ({ page }) => {
        page.once('dialog', async (dialog) => {
          await dialog.accept()
        })

        await page.getByRole('link', { name: 'another Test Blog by Sergej Gavrilov' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('another Test Blog')).not.toBeVisible()
      })
    })
  })
})
