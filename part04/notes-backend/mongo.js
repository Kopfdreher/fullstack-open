// Quick CLI for notes and users in MongoDB (uses MONGODB_URI from utils/config).
// Prefix with "test" to point NODE_ENV at the test database.
//
//   node mongo.js                  list notes
//   node mongo.js test             list notes in the test database
//   node mongo.js note             list notes
//   node mongo.js note "content" true [username]
//   node mongo.js user             list users
//   node mongo.js user <username> <name> <password>
//   node mongo.js test user        list users in the test database
//   node mongo.js test user <username> <name> <password>
//
// content and username/password must be at least 5 and 3 characters.
// important is the string "true" or "false". username on a note is optional.

const args = process.argv.slice(2)
if (args[0] === 'test') {
  process.env.NODE_ENV = 'test'
  args.shift()
}

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { MONGODB_URI } = require('./utils/config')
const Note = require('./models/note')
const User = require('./models/user')

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)

const [command, ...rest] = args

const listNotes = async () => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  console.log('notes:')
  notes.forEach((note) => {
    const owner = note.user ? note.user.username : 'no user'
    console.log(
      `- ${note.content} important=${note.important} user=${owner} id=${note.id}`,
    )
  })
}

const addNote = async (content, important, username) => {
  if (!content || content.length < 5) {
    console.error('error: content must be at least 5 characters long')
    process.exit(1)
  }

  const user = username ? await User.findOne({ username }) : null
  if (username && !user) {
    console.error(`error: user '${username}' does not exist`)
    process.exit(1)
  }

  const note = new Note({
    content,
    important: important === 'true',
    user: user ? user._id : undefined,
  })
  const savedNote = await note.save()

  if (user) {
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
  }

  console.log(`added note '${savedNote.content}' id=${savedNote.id}`)
}

const listUsers = async () => {
  const users = await User.find({})
  console.log('users:')
  users.forEach((u) =>
    console.log(`- ${u.username} (${u.name || 'no name'}) id=${u.id}`),
  )
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
  console.log(
    `added user '${savedUser.username}' (${savedUser.name || 'no name'}) id=${savedUser.id}`,
  )
}

const main = async () => {
  try {
    if (!command) {
      await listNotes()
    } else if (command === 'note') {
      const [content, important, username] = rest
      if (!content) await listNotes()
      else await addNote(content, important, username)
    } else if (command === 'user') {
      const [username, name, password] = rest
      if (!username) await listUsers()
      else await addUser(username, name, password)
    } else {
      console.error(
        'usage: node mongo.js [test] [note <content> <true|false> [username] | user [username name password]]',
      )
      process.exit(1)
    }
  } catch (error) {
    console.error('error:', error.message)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
  }
}

main()
