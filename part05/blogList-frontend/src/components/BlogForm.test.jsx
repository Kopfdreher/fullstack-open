import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls handler with right details when a new blog is created', async () => {
  const mockAdd = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm addBlog={mockAdd} />)

  await user.type(screen.getByPlaceholderText('title'), 'test title')
  await user.type(screen.getByPlaceholderText('author'), 'test author')
  await user.type(screen.getByPlaceholderText('url'), 'test url')
  await user.click(screen.getByText('create'))

  expect(mockAdd).toHaveBeenCalledTimes(1)
  expect(mockAdd).toHaveBeenCalledWith({
    title: 'test title',
    author: 'test author',
    url: 'test url'
  })
})
