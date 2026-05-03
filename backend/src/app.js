import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoute.js';
import projectRouter from './routes/projectRoutes.js';

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json())

app.use('/api/auth',authRouter)

app.use('/api/project',projectRouter)

export default app