import express from 'express'
import mongoose from 'mongoose'
import env from 'dotenv'
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import cookieParser from 'cookie-parser'

env.config()

mongoose
.connect(process.env.MONGO)
.then(()=>console.log('Succcessfully connected to database'))

const app=express()

app.use(express.json())
app.use(cookieParser())

app.listen(3000,()=>console.log(`Server running successfully on port 3000`))

app.use('/api/user',userRoute)
app.use('/api/auth',authRoute)

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500
    const message=err.message || 'Internal Server Error'

    res.json({
        success:false,
        statusCode,
        message
    })
})