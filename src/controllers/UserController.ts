import { Request, Response } from 'express'
import BaseController from './BaseController'
import User from '../models/User'

class UserController extends BaseController {
  // constructor() {
  //   super()
  // }

  async create(req: Request, res: Response): Promise<void> {
    const user = new User(req.body)

    try {
      await user.save()
      res.status(201).json(user)
    } catch (e) {
      res.status(400).send(e)
    }
  }

  async all(_: Request, res: Response) {
    try {
      const users = await User.find({})
      res.json(users)
    } catch (e) {
      res.status(500).send()
    }
  }

  async oneById(req: Request, res: Response) {
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

  public async update(req: Request, res: Response) {
    const { id } = req.params

    if (!super.isValidUpdate(req.body, ['name', 'email', 'password'])) {
      res.status(400).json({
        error: 'Invalid update'
      })
    }

    try {
      const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      })

      if (!user) {
        res.status(404).send()
        return
      }

      res.json(user)
    } catch (e) {
      res.status(400).send()
    }
  }
}

export default new UserController()
