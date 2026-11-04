import { useState } from 'react'

const Blog = ({ blog, addLike }) => {
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

  return (
    <div style={blogStyle}>
      {blog.title} <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (<div>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={onLike}>like</button></div>
        <div>{blog.author}</div>
      </div>)}
    </div>
  )
}

export default Blog
