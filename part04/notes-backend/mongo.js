const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')


mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// // note.save().then((result) => {
// //   console.log('note saved!')
// //   mongoose.connection.close()
// // })

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
