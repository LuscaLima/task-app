import { Router } from 'express'
const router = Router()
import Task from '../controllers/TaskController'

/** Criation route */
router.post('/', Task.create)

/** Get all tasks */
router.get('/', Task.all)

/** Get one task by ID */
router.get('/:id', Task.oneById)

/** Update one task by ID */
router.put('/:id', Task.update)

/** Delete one task by ID */
router.delete('/:id', Task.delete)

export default router
