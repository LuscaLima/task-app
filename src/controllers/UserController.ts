import { Request, Response } from 'express'
import User from '../models/User'

class UserController {
  constructor() {}

  public create(req: Request, res: Response) {
    const user = new User(req.body)

    user
      .save()
      .then(() => {
        res.status(201).json(user)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }
}

export default new UserController()
