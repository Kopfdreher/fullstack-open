const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}
  return blogs.reduce((max, blog) => {
    if (blog.likes > max.likes) return blog
    else return max
  })
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }
