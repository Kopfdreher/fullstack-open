const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MONGODB_URI } = require('./utils/config')
const User = require('./models/user')

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)

const [, , username, name, password] = process.argv

const listUsers = async () => {
  const users = await User.find({})
  console.log('users:')
  users.forEach(u => console.log(`- ${u.username} (${u.name || 'no name'}) id=${u.id}`))
}

const addUser = async (username, name, password) => {
  if (!username || username.length < 3) {
    console.error('error: username must be at least 3 characters long')
    process.exit(1)
  }
  if (!password || password.length < 3) {
    console.error('error: password must be at least 3 characters long')
    process.exit(1)
  }

  const existing = await User.findOne({ username })
  if (existing) {
    console.error(`error: username '${username}' already exists`)
    process.exit(1)
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({ username, name, passwordHash })
  const savedUser = await user.save()
  console.log(`added user '${savedUser.username}' (${savedUser.name || 'no name'}) id=${savedUser.id}`)
}

const main = async () => {
  try {
    if (!username) {
      await listUsers()
    } else {
      await addUser(username, name, password)
    }
  } catch (error) {
    console.error('error:', error.message)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
  }
}

main()
