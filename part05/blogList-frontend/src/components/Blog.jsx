import { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog }) => {
  const [ visible, setVisible ] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const onLike = async (event) => {
    event.preventDefault()
    await addLike({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user?._id || blog.user || null
    })
  }

  const onRemove = async (event) => {
    event.preventDefault()
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) await removeBlog(blog.id)
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (<div className='details'>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={onLike}>like</button></div>
        <div>{blog.author}</div>
        <button onClick={onRemove}>remove</button>
      </div>)}
    </div>
  )
}

export default Blog
