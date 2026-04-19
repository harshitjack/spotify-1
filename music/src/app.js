import express from 'express';
import musicRouter from './routes/musicRoutes.js';
import cookieParser from 'cookie-parser'

const app = express()
app.use(express,json())
app.use("/api/music",musicRouter)

export default app;