import Alert from '@mui/material/Alert'

const Notification = ({ message }) => {
  if (message === null) return null

  return <Alert severity='error'>{message}</Alert>
}

export default Notification
