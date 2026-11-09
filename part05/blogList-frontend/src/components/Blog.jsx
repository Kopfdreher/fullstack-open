import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'

const Blog = ({ blog, addLike, removeBlog, user }) => {
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
    <Card className='blog' variant='outlined' sx={{ marginTop: 2 }}>
      <CardContent>
        <Typography variant='h5' component='h2'>
          {blog.title}
        </Typography>
        <Typography color='text.secondary' gutterBottom>
          by {blog.author}
        </Typography>
        <Typography className='details'>
          <Link href={blog.url} target='_blank' rel='noreferrer'>
            {blog.url}
          </Link>
        </Typography>
        <Typography sx={{ marginTop: 1 }}>
          Added by {blog.user.username}
        </Typography>
        <Typography>
          {blog.likes} likes{' '}
          {user && (
            <Button size='small' variant='outlined' onClick={onLike}>
              like
            </Button>
          )}
          {user && blog.user.username === user.username && (
            <Button
              color='error'
              variant='outlined'
              size='small'
              onClick={onRemove}
            >
            remove
            </Button>
          )}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Blog
