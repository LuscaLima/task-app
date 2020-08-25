import express from 'express'
import './database'
import { errorHandler } from './middlewares/general'
import UserRoutes from './routes/UserRoutes'
import TaskRoutes from './routes/TaskRoutes'

/** Instantiate the express and define the port to listen */
const app = express()
const port = process.env.PORT || 3000

/** All basic settings for express */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(errorHandler)

/** Setup all routes associate with the task route */
app.use('/task', TaskRoutes)

/** Setup all routes associate with the user route */
app.use('/user', UserRoutes)

app.listen(port, () => {
  console.log(`Aplicação escutando na porta ${port}`)
})
