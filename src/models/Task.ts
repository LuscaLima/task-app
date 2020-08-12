import mongoose, { Schema } from 'mongoose'

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    required: false,
    default: false
  }
})

const Task = mongoose.model('Tasks', TaskSchema)

export default Task
