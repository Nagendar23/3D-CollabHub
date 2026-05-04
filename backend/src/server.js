import dotenv from 'dotenv'
dotenv.config()

import cloudinary from './config/cloudinary.js'

// Configure cloudinary AFTER dotenv is loaded
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

console.log("Cloud name:", process.env.CLOUDINARY_NAME);
console.log("API key:", process.env.CLOUDINARY_KEY);
console.log("API secret exists:", !!process.env.CLOUDINARY_SECRET);

import app from './app.js'
import { connectDB } from './config/db.js'

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