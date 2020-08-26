import { Request, Response } from 'express'
import { IRequest } from '../interfaces/Middleware'
import sharp from 'sharp'
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
      const token = await user.generateAuthToken()
      res.status(201).json({ user, token })
    } catch (e) {
      res.status(400).send(e)
    }
  }

  async setAvatar(req: IRequest, res: Response) {
    const user = req.user

    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 400,
        height: 400
      })
      .png()
      .toBuffer()

    if (user) {
      user.avatar = buffer
    }

    await user?.save()

    res.send()
  }

  async removeAvatar(req: IRequest, res: Response) {
    const user = req.user

    if (user) {
      user.avatar = undefined
    }

    await user?.save()

    res.send()
  }

  async getAvatar(req: IRequest, res: Response) {
    try {
      const { id } = req.params

      const user = await User.findById(id)

      if (!user || !user.avatar) {
        throw new Error()
      }

      res.set('Content-Type', 'image/png')
      res.send(user.avatar)
    } catch (e) {
      res.status(404).send()
    }
  }

  async me(req: IRequest, res: Response) {
    res.json(req.user)
  }

  public async update(req: IRequest, res: Response) {
    const updates = ['name', 'email', 'password']

    if (!super.isValidUpdate(req.body, updates)) {
      res.status(400).json({
        error: 'Invalid update'
      })
    }

    try {
      const user = req.user

      if (user) {
        updates.forEach(update => {
          setProperty(user, update, req.body)
        })

        await user.save()
      }

      res.json(user)
    } catch (e) {
      res.status(400).send(e)
    }
  }

  public async delete(req: IRequest, res: Response) {
    try {
      const user = req.user

      await user?.remove()
      res.json(user)
    } catch (e) {
      res.status(500).send()
    }
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body

    try {
      const user = await User.findByCredentials(email, password)
      const token = await user.generateAuthToken()

      res.json({ user, token })
    } catch (e) {
      res.status(400).send()
    }
  }

  public async logout(req: IRequest, res: Response) {
    try {
      const user = req.user

      if (!user?.tokens) {
        throw new Error()
      }

      user.tokens = user.tokens.filter(token => token.token !== req.token)
      await user.save()

      res.send()
    } catch (e) {
      res.status(500).send()
    }
  }

  public async logoutAll(req: IRequest, res: Response) {
    try {
      const user = req.user

      if (!user?.tokens) {
        throw new Error()
      }

      user.tokens = []
      await user.save()

      res.send()
    } catch (e) {
      res.status(500).send()
    }
  }
}

export default new UserController()
