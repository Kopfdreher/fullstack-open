import { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog, user }) => {
  const [ visible, setVisible ] = useState(false)

  const onLike = async (event) => {
    event.preventDefault()
    await addLike({
      ...blog,
      likes: blog.likes + 1
    })
  }

  const onRemove = async (event) => {
    event.preventDefault()
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) await removeBlog(blog.id)
  }

  return (
    <div className='blog'>
      <h2>{blog.author}: {blog.title}</h2>
      <div className='details'>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={onLike}>like</button></div>
        <div>Added by {blog.user.username}</div>
        {user && blog.user.username === user.username && (
          <button onClick={onRemove}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
