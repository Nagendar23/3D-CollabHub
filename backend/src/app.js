import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoute.js';
import projectRouter from './routes/projectRoutes.js';
import fileRoutes from './routes/fileRoutes.js'

const app = express();

app.use(cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
  credentials: true
}))
app.use(express.json())

app.use('/api/auth',authRouter)

app.use('/api/project',projectRouter)

app.use('/api/files',fileRoutes)

export default app