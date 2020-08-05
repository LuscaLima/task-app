import mongoose from 'mongoose'

/** Settings */
import { url, options } from '../config/database'

mongoose
  .connect(url, options)
  .then(() => {
    console.log('Database connected and running')
  })
  .catch(err => {
    console.error('Database connection failed. Error: ' + err)
  })

// const Task = mongoose.model(
//   'Task',
//   new mongoose.Schema({
//     description: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     completed: {
//       type: Boolean,
//       required: false,
//       default: false
//     }
//   })
// )

// const nt = new Task({
//   description: 'Clean the house'
// })

// nt.save()
