import { Router } from 'express'
const router = Router()
import Task from '../controllers/TaskController'

/** Criation route */
router.post('/', Task.create)

export default router
