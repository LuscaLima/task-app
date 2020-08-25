import mongoose, { Schema } from 'mongoose'
import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { IUserSchema, IUser, IUserModel } from '../interfaces/User'
import Task from './Task'

// /** Make the HASH env variable visible as a string */
declare const process: {
  env: {
    HASH: string
  }
}

const userSchema: Schema = new Schema(
  {
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
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
)

/** Get all tasks related an user */
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

/** Generates a auth token JWT based from single user */
userSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user = this // Its better refer this like a user
  const token = jwt.sign({ _id: user._id }, process.env.HASH)

  user.tokens = [...user.tokens, { token }]
  // This method already save the token on the instance
  await user.save()

  return token
}

/** Send just the public data about an user */
userSchema.methods.toJSON = function (): object {
  const user = this // Its better refer this like a user
  const userObject = user.toObject()

  delete userObject.password // remove the secrete password
  delete userObject.tokens // remove the array of tokens
  delete userObject.avatar // remove the avatar

  return userObject
}

/** Finds a user by email and password*/
userSchema.statics.findByCredentials = async (
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
userSchema.pre<IUserSchema>('save', async function (next): Promise<void> {
  const user = this // Its better refer this like a user

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

/** Remove all user taks when their is removed */
userSchema.pre('remove', async function (next) {
  const user = this // Its better refer this like a user

  await Task.deleteMany({ owner: user._id })

  next()
})

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema)

export default User
