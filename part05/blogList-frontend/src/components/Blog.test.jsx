import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'

const blog = {
  title: 'a good title',
  author: 'some author',
  url: 'some URL',
  likes: 42,
  user: { username: 'owner', name: 'Owner' }
}

const owner = { username: 'owner', name: 'Owner' }
const otherUser = { username: 'other', name: 'Other' }

test('shows blog information and likes but no buttons to unauthenticated users', () => {
  render(<Blog blog={blog} />)

  expect(screen.getByText('a good title', { exact: false })).toBeInTheDocument()
  expect(screen.getByText('some author', { exact: false })).toBeInTheDocument()
  expect(screen.getByText('some URL')).toBeInTheDocument()
  expect(screen.getByText('likes 42', { exact: false })).toBeInTheDocument()
  expect(screen.queryByText('like')).not.toBeInTheDocument()
  expect(screen.queryByText('remove')).not.toBeInTheDocument()
})

test('shows only the like button to an authenticated user who is not the creator', () => {
  render(<Blog blog={blog} user={otherUser} addLike={vi.fn()} />)

  expect(screen.getByText('like')).toBeInTheDocument()
  expect(screen.queryByText('remove')).not.toBeInTheDocument()
})

test('shows the like and remove buttons to the blog creator', () => {
  render(<Blog blog={blog} user={owner} addLike={vi.fn()} removeBlog={vi.fn()} />)

  expect(screen.getByText('like')).toBeInTheDocument()
  expect(screen.getByText('remove')).toBeInTheDocument()
})

test('calls like handler twice when like is clicked twice', async () => {
  const mockLike = vi.fn()

  render(<Blog blog={blog} user={otherUser} addLike={mockLike} />)

  const user = userEvent.setup()
  await user.click(screen.getByText('like'))
  await user.click(screen.getByText('like'))

  expect(mockLike).toHaveBeenCalledTimes(2)
})
