import { Router } from 'express'
const router = Router()
import User from '../controllers/UserController'

/** Criation route */
router.post('/', User.create)

/** Get all users */
router.get('/', User.all)

/** Get one user by ID */
router.get('/:id', User.oneById)

/** Update one task by ID */
router.put('/:id', User.update)

/** Delete one user by ID */
router.delete('/:id', User.delete)

/** Login */
router.post('/login', User.login)

export default router
