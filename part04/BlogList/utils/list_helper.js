const _ = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}
  return blogs.reduce((max, blog) => {
    if (blog.likes > max.likes) return blog
    else return max
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  return _(blogs)
    .groupBy('author')
    .map((authorBlogs, author) => ({
      author,
      blogs: authorBlogs.length,
    }))
    .maxBy('blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  return _(blogs)
    .groupBy('author')
    .map((authorBlogs, author) => ({
      author,
      likes: totalLikes(authorBlogs),
    }))
    .maxBy('likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
