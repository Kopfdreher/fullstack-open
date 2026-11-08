import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'

const blog = {
  title: 'a good title',
  author: 'some author',
  url: 'some URL',
  likes: 42
}

test('renders title and author but not url or likes by default', () => {
  render(<Blog blog={blog} />)

  expect(screen.getByText('a good title', { exact: false })).toBeInTheDocument()
  expect(screen.getByText('some author', { exact: false })).toBeInTheDocument()
  expect(screen.queryByText('some URL')).not.toBeInTheDocument()
  expect(screen.queryByText('likes', { exact: false })).not.toBeInTheDocument()
})

test('shows url and likes when view button is clicked', async () => {
  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  await user.click(screen.getByText('view'))

  expect(screen.getByText('some URL')).toBeInTheDocument()
  expect(screen.getByText('likes 42', { exact: false })).toBeInTheDocument()
})

test('calls like handler twice when like is clicked twice', async () => {
  const mockLike = vi.fn()

  render(<Blog blog={blog} addLike={mockLike} />)

  const user = userEvent.setup()
  await user.click(screen.getByText('view'))
  await user.click(screen.getByText('like'))
  await user.click(screen.getByText('like'))

  expect(mockLike).toHaveBeenCalledTimes(2)
})

test('shows the remove button only to the user who added the blog', async () => {
  const ownedBlog = {
    ...blog,
    user: { id: 'owner-id', name: 'Owner' }
  }

  const user = userEvent.setup()

  const { rerender } = render(
    <Blog blog={ownedBlog} user={{ id: 'owner-id', name: 'Owner' }} />
  )
  await user.click(screen.getByText('view'))
  expect(screen.getByText('remove')).toBeInTheDocument()

  rerender(<Blog blog={ownedBlog} user={{ id: 'other-id', name: 'Other' }} />)
  expect(screen.queryByText('remove')).not.toBeInTheDocument()
})
