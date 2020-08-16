import { Request } from 'express'
import { IUser } from '../User'

/** Specific local interface for Request object */
export interface IRequest extends Request {
  user?: IUser
  token?: string
}
