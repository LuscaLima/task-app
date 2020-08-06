import { Request, Response } from 'express'
import Task from '../models/Task'

class TaskController {
  constructor() {}

  public create(req: Request, res: Response) {
    const task = new Task(req.body)

    task
      .save()
      .then(() => {
        res.status(201).json(task)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }
}

export default new TaskController()
