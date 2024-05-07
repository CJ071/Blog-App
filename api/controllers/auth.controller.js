import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import { errorHandler } from '../utils/error.js'

export const signup=async(req,res,next)=>{
    try {
        const {username,email,password}=req.body

        if(!username || !email || !password || username==='' || email==='' || password==='')
            {
                next(errorHandler(400,'All fields are required'))
            }

        const hashedPass=bcryptjs.hashSync(password,10)

        const user=new User(
            {
                username,
                email,
                password:hashedPass
            }
        )

        await user.save()

        res.json("Signup Successfull")
    } catch (error) {
        next(error)
    }
}