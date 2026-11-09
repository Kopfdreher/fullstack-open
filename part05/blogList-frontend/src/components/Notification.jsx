import Alert from '@mui/material/Alert'

const Notification = ({ message }) => {
  if (message === null) return null

  return (
    <Alert severity='error' sx={{ margin: 1 }}>
      {message}
    </Alert>
  )
}

export default Notification
