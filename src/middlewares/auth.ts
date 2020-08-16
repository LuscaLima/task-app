import { Response, NextFunction } from 'express'
import { IRequest } from '../interfaces/Middleware'
import jwt from 'jsonwebtoken'
import User from '../models/User'

/** Make the HASH env variable visible as a string */
declare const process: {
  env: {
    HASH: string
  }
}

/** For casting the data to get the '_id' attr */
type decoded = {
  _id: string
}

/** This function is executed in every route that takes authtentication */
export async function auth(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    // This validation is a simple mode to avoid the TS typecheking
    if (!token) {
      throw new Error()
    }

    const decoded = <decoded>jwt.verify(token, process.env.HASH)

    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

    if (!user) {
      throw new Error()
    }

    // Prevents this same user from being brought back from
    // the database again in the handler of the route
    req.user = user

    next()
  } catch (e) {
    res.status(401).json({
      error: 'Please, authenticate first'
    })
  }
}
