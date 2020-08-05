import { Router } from 'express'
const router = Router()
import User from '../controllers/UserController'

router.post('/', User.create)

export default router
