import mongoose, { Schema } from 'mongoose'
import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { IUserSchema, IUser, IUserModel } from '../interfaces/User'

// /** Make the HASH env variable visible as a string */
declare const process: {
  env: {
    HASH: string
  }
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
})

/** Generates a auth token JWT based from single user */
UserSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user = this // Its better refer this like a user
  const token = jwt.sign({ _id: user._id }, process.env.HASH)

  user.tokens = [...user.tokens, { token }]
  await user.save()

  return token
}

/** Finds a user by email and password*/
UserSchema.statics.findByCredentials = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = bcrypt.compareSync(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

/**
 * Whenever the 'save' event is triggered,
 * the password is handled if it exists
 * */
UserSchema.pre<IUserSchema>('save', async function (next): Promise<void> {
  const user = this // Its better refer this like a user

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User: IUserModel = mongoose.model<IUser, IUserModel>('Users', UserSchema)

export default User
