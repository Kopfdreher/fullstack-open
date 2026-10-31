const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) response.json(blog)
  else response.status(404).end()
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes || 0,
  })

  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogRouter
