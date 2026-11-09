import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    const success = await handleLogin({ username, password })
    if (success) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            label='username'
            margin='normal'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label='password'
            type='password'
            margin='normal'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div>
          <Button variant='contained' color='primary' type='submit'>
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
