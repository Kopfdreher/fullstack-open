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
    await request.post('/api/users', {
      data: {
        name: 'another User',
        username: 'another',
        password: 'superSave',
      },
    })
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'sgavrilo', 'superSave')
      await expect(page.getByText('Sergej Gavrilov logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'sgavrilo', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(
        page.getByText('Sergej Gavrilov logged in'),
      ).not.toBeVisible()
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
      await expect(page.getByText('Test Blog')).toBeVisible()
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
        const blogElement = page.getByText('another Test Blog').locator('..')

        await blogElement.getByRole('button', { name: 'view' }).click()
        await blogElement.getByRole('button', { name: 'like' }).click()
        await expect(blogElement.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted by same user', async ({ page }) => {
        const blogElement = page.getByText('another Test Blog').locator('..')

        page.once('dialog', async (dialog) => {
          await dialog.accept()
        })

        await blogElement.getByRole('button', { name: 'view' }).click()
        await blogElement.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('another Test Blog')).toBeVisible()
      })

      test('a blog cannot be delete by another user', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'another', 'superSave')

        const blogElement = page.getByText('another Test Blog').locator('..')
        await blogElement.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('remove')).not.toBeVisible()
      })
    })
  })
})
