import mongoose from 'mongoose'

/** Settings */
import { url, options } from '../config/database'

mongoose
  .connect(url, options)
  .then(() => {
    console.log('Database connected and running')
  })
  .catch(err => {
    console.error('Database connection failed. Error: ' + err)
  })
