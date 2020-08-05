import mongoose, { Schema } from 'mongoose'
import isEmail from 'validator/lib/isEmail'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value: string): boolean {
      if (!isEmail(value)) {
        throw new Error('Email is invalid')
      }

      return true
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value: string): boolean {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password is invalid')
      }

      return true
    }
  },
  age: {
    type: Number,
    validate(value: number): boolean {
      if (value < 0) {
        throw new Error('The Age must be a positive number')
      }

      return true
    }
  }
})

const Users = mongoose.model('Users', UserSchema)

export default Users
