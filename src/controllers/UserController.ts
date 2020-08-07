import { Request, Response } from 'express'
import User from '../models/User'
import BaseController from './BaseController'

class UserController implements BaseController {
  constructor() {}

  public async create(req: Request, res: Response) {
    const user = new User(req.body)

    try {
      await user.save()
      res.status(201).json(user)
    } catch (e) {
      res.status(400).send(e)
    }
  }

  public async all(_: Request, res: Response) {
    try {
      const users = await User.find({})
      res.json(users)
    } catch (e) {
      res.status(500).send()
    }
  }

  public async oneById(req: Request, res: Response) {
    const { id } = req.params

    try {
      const user = await User.findById(id)

      if (!user) {
        res.status(404).send()
        return
      }

      res.json(user)
    } catch (e) {
      res.status(404).send(e)
    }
  }
}

export default new UserController()
