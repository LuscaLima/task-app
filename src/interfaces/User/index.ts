import { Document, Model } from 'mongoose'

interface Token {
  token: string
}

/** Interface for user schema */
export interface IUserSchema extends Document {
  name: string
  email: string
  password: string
  tokens: Token[]
}

/** Interface for user base */
export interface IUserBase extends IUserSchema {}

/** Interface for user */
export interface IUser extends IUserBase {
  generateAuthToken(): Promise<string>
}

/** Interface for user model */
export interface IUserModel extends Model<IUser> {
  findByCredentials(email: string, password: string): IUser
}
