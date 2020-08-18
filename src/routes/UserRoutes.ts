import { Router } from 'express'
const router = Router()
import User from '../controllers/UserController'
import { auth } from '../middlewares/auth'

/** Criation route */
router.post('/', User.create)

/** Get the profile of the current user */
router.get('/me', auth, User.me)

/** Update the logged user */
router.put('/me', auth, User.update)

/** Delete the logged user */
router.delete('/me', auth, User.delete)

/** Login route */
router.post('/login', User.login)

/** Logout route */
router.post('/logout', auth, User.logout)

/** Logout in all sessions route */
router.post('/logoutall', auth, User.logoutAll)

export default router
