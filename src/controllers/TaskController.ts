import { Request, Response } from 'express'
import BaseController from './BaseController'
import Task from '../models/Task'

class TaskController extends BaseController {
  public async create(req: Request, res: Response): Promise<void> {
    const task = new Task(req.body)

    try {
      await task.save()
      res.status(201).json(task)
    } catch (e) {
      res.status(400).send(e)
    }
  }

  public async all(_: Request, res: Response): Promise<void> {
    try {
      const tasks = await Task.find({})
      res.json(tasks)
    } catch (e) {
      res.status(500).send()
    }
  }

  public async oneById(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    try {
      const task = await Task.findById(id)

      if (!task) {
        res.status(404).send()
        return
      }

      res.json(task)
    } catch (e) {
      res.status(404).send(e)
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    if (!super.isValidUpdate(req.body, ['title', 'description', 'completed'])) {
      res.status(400).json({
        error: 'Invalid update'
      })
    }

    try {
      const task = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      })

      if (!task) {
        res.status(404).send()
        return
      }

      res.json(task)
    } catch (e) {
      res.status(400).send()
    }
  }
}

export default new TaskController()
