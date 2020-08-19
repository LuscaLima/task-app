import { Router } from 'express'
const router = Router()
import Task from '../controllers/TaskController'
import { auth } from '../middlewares/auth'

/** Criation route */
router.post('/', auth, Task.create)

/** Get all tasks */
router.get('/', auth, Task.all)

/** Get one task by ID */
router.get('/:id', auth, Task.oneById)

/** Update one task by ID */
router.put('/:id', auth, Task.update)

/** Delete one task by ID */
router.delete('/:id', auth, Task.delete)

export default router
