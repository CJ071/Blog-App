import express from 'express'
import mongoose from 'mongoose'
import env from 'dotenv'

env.config()

mongoose
.connect(process.env.MONGO)
.then(()=>console.log('Succcessfully connected to database'))

const app=express()

app.listen(3000,()=>console.log(`Server running successfully on port 3000`))