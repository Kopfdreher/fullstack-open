import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'

const App = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(() => {
    const UserJSON = window.localStorage.getItem('loggedBlogListUser')
    return UserJSON ? JSON.parse(UserJSON) : null
  })
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const fetchedBlogs = await blogService.getAll()
        if (fetchedBlogs)
          setBlogs(fetchedBlogs.sort((a, b) => b.likes - a.likes))
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
        setErrorMessage(error)
      }
    })()
  }, [])

  useEffect(() => {
    blogService.setToken(user ? user.token : null)
  }, [user])

  const handleLogin = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject)

      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
      return true
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
    blogService.setToken(null)
    navigate('/')
  }

  const addLike = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject)
      if (updatedBlog) {
        setBlogs(
          blogs
            .map((blog) => (blog.id === blogObject.id ? updatedBlog : blog))
            .sort((a, b) => b.likes - a.likes),
        )
      }
      return true
    } catch {
      setErrorMessage('adding like failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      if (returnedBlog) setBlogs(blogs.concat(returnedBlog))
      navigate('/')
      return true
    } catch {
      setErrorMessage('creating blog failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      navigate('/')
      return true
    } catch {
      setErrorMessage('deleting blog failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const blogSection = () => (
    <div>
      <h2>blogs</h2>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </li>
        ))}
      </ul>
    </div>
  )

  const padding = {
    padding: 5
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find((b) => b.id === match.params.id)
    : null

  return (
    <div>
      <Notification message={errorMessage} />
      <div>
        <Link style={padding} to='/'>blogs</Link>
        {user && <Link style={padding} to='/create'>new blog</Link>}
        {user && <button onClick={handleLogout}>logout</button>}
        {!user && <Link style={padding} to='/login'>login</Link>}
      </div>
      <Routes>
        <Route path='/' element={
          blogSection()
        } />
        <Route path='/login' element={
          <LoginForm user={user} handleLogin={handleLogin} handleLogout={handleLogout}/>
        } />
        <Route path='/create' element={
          <BlogForm addBlog={addBlog} />
        } />
        <Route path='/blogs/:id' element={
          blog
            ? <Blog
              blog={blog}
              addLike={addLike}
              removeBlog={removeBlog}
              user={user}
            />
            : <p>blog not found</p>
        } />
      </Routes>
    </div>
  )
}

export default App
