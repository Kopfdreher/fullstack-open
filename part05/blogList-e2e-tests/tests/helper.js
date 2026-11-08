const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByLabel('title: ').fill(title)
  await page.getByLabel('author: ').fill(author)
  await page.getByLabel('url: ').fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  await page.getByText(title).waitFor()
}
const createBlogWithLikes = async (request, blogData, userCredentials) => {
  const loginResponse = await request.post('/api/login', {
    data: userCredentials
  })
  const user = await loginResponse.json()

  await request.post('/api/blogs', {
    data: blogData,
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}

export { loginWith, createBlog, createBlogWithLikes }
