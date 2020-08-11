import { Request, Response } from 'express'
import BaseController from './BaseController'
import User from '../models/User'

/** Just set a new value to a property of an user in update method */
function setProperty<T, U extends keyof T>(obj: T, key: U, body: T): void {
  if (!!body[key]) {
    obj[key] = body[key]
  }
}

class UserController extends BaseController {
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
    const updates = ['name', 'email', 'password']

    if (!super.isValidUpdate(req.body, updates)) {
      res.status(400).json({
        error: 'Invalid update'
      })
    }

    try {
      const user = await User.findById(id)

      if (user) {
        updates.forEach(update => {
          setProperty(user, update, req.body)
        })

        await user.save()
      }

      if (!user) {
        res.status(404).send()
        return
      }

      res.json(user)
    } catch (e) {
      res.status(400).send(e)
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params

    try {
      const user = await User.findByIdAndDelete(id)

      if (!user) {
        res.status(404).send()
        return
      }

      res.json(user)
    } catch (e) {
      res.status(500).send()
    }
  }
}

export default new UserController()
