import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    const success = await addBlog({ title, author, url })
    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            label='title'
            margin='normal'
            value={title}
            placeholder='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            label='author'
            margin='normal'
            value={author}
            placeholder='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            label='url'
            margin='normal'
            value={url}
            placeholder='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          <Button variant='contained' color='primary' type='submit'>
            create
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
