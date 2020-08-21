import { Response } from 'express'
import { IRequest } from '../interfaces/Middleware'
import { IFlexObject } from '../interfaces'
import BaseController from './BaseController'
import Task from '../models/Task'

class TaskController extends BaseController {
  public async create(req: IRequest, res: Response): Promise<void> {
    const task = new Task({ ...req.body, owner: req.user?._id })

    try {
      await task.save()
      res.status(201).json(task)
    } catch (e) {
      res.status(400).send(e)
    }
  }

  public async all(req: IRequest, res: Response): Promise<void> {
    try {
      /** Filtering and pagination and sorting */
      const { completed, limit, skip, sortby } = req.query

      const match: IFlexObject = {}

      if (completed) {
        match.completed = completed === 'true'
      }

      const sort: IFlexObject = {}

      const order: IFlexObject = {
        asc: 1, // ascendant
        desc: -1 // descendant
      }

      if (sortby) {
        const raw = <string>sortby
        const [field, ord] = raw.split(':')
        sort[field] = order[ord]
      }

      const user = req.user
      await user
        ?.populate({
          path: 'tasks',
          match,
          options: {
            limit: Math.abs(parseInt(<string>limit)),
            skip: Math.abs(parseInt(<string>skip)),
            sort
          }
        })
        .execPopulate()

      res.json(user?.tasks)
    } catch (e) {
      res.status(500).send()
    }
  }

  public async oneById(req: IRequest, res: Response): Promise<void> {
    const _id = req.params.id

    try {
      const task = await Task.findOne({ _id, owner: req.user?._id })

      if (!task) {
        res.status(404).send()
        return
      }

      res.json(task)
    } catch (e) {
      res.status(404).send(e)
    }
  }

  public async update(req: IRequest, res: Response): Promise<void> {
    const _id = req.params.id

    if (!super.isValidUpdate(req.body, ['title', 'description', 'completed'])) {
      res.status(400).json({
        error: 'Invalid update'
      })
    }

    try {
      const task = await Task.findOneAndUpdate(
        { _id, owner: req.user?._id },
        req.body,
        {
          new: true,
          runValidators: true
        }
      )

      if (!task) {
        res.status(404).send()
        return
      }

      res.json(task)
    } catch (e) {
      res.status(400).send()
    }
  }

  public async delete(req: IRequest, res: Response) {
    const _id = req.params.id

    try {
      const task = await Task.findOneAndDelete({ _id, owner: req.user?._id })

      if (!task) {
        res.status(404).send()
        return
      }

      res.json(task)
    } catch (e) {
      res.status(500).send()
    }
  }
}

export default new TaskController()
