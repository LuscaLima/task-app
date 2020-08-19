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
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

const Task = mongoose.model('Task', TaskSchema)

export default Task
