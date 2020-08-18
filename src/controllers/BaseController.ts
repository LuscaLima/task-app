import { Request, Response } from 'express'

abstract class BaseController {
  /**
   * create
   */
  abstract create(req: Request, res: Response): Promise<void>

  /** update by id */
  abstract update(req: Request, res: Response): Promise<void>

  /** delete by id */
  abstract delete(req: Request, res: Response): Promise<void>

  /** is valid update */
  isValidUpdate(data: object, keys: Array<string>): boolean {
    const updates = Object.keys(data)

    return updates.every(update => keys.includes(update))
  }
}

export default BaseController
