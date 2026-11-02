const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('blog api tests', () => {
  let token = null

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    await User.create({ username: 'root', name: 'Superuser', passwordHash })

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    token = loginResponse.body.token

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('get requests', () => {
    test('all blogs are returned as json', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is reachable via id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToFind = blogsAtStart[0]
      const response = await api
        .get(`/api/blogs/${blogToFind.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(response.body, blogToFind)
    })
  })

  describe('post requests', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      assert.strictEqual(response.body.title, newBlog.title)
      assert.strictEqual(response.body.author, newBlog.author)
      assert.strictEqual(response.body.url, newBlog.url)
      assert.strictEqual(response.body.likes, newBlog.likes)
    })

    test('a blogs undefined likes are set to 0 by default', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('an invalid blog (no title & url) cannot be added', async () => {
      const invalidBlog = {
        test: 'test',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('adding a blog fails with 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('delete requests', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const newBlog = {
        title: 'To be deleted',
        author: 'Root',
        url: 'http://example.com/delete-me',
        likes: 0,
      }

      const created = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      const blogToDelete = created.body

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(blogToDelete.id))
    })
  })

  describe('put requests', () => {
    test('succeeds at implementing a valid blog update', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      blogToUpdate.likes++

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      assert.strictEqual(response.body.title, blogToUpdate.title)
      assert.strictEqual(response.body.author, blogToUpdate.author)
      assert.strictEqual(response.body.url, blogToUpdate.url)
      assert.strictEqual(response.body.likes, blogToUpdate.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
