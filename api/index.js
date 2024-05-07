import express from 'express'
import mongoose from 'mongoose'
import env from 'dotenv'
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'

env.config()

mongoose
.connect(process.env.MONGO)
.then(()=>console.log('Succcessfully connected to database'))

const app=express()

app.use(express.json())

app.listen(3000,()=>console.log(`Server running successfully on port 3000`))

app.use('/api/user',userRoute)
app.use('/api/auth',authRoute)