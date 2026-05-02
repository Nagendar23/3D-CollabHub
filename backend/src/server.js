import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './config/db.js'

dotenv.config()

const port = process.env.PORT || 8000

const startServer = async () => {
  try {
    await connectDB()

    app.get('/', (req, res) => {
      res.json('the backend is working')
    })

    app.listen(port, () => {
      console.log(`PORT running on the server ${port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()