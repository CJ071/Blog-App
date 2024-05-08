import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

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

export const signin=async(req,res,next)=>{

    try {
        const {email,password}=req.body

        if(!email || !password || email==='' || password==='')
        {
            return next(errorHandler(400,'All fields are required'))
        }

        const validUser=await User.findOne({email})

        if(!validUser)
            {
                return next(errorHandler(404,'User not found'))
            }

        const validPass=bcryptjs.compareSync(password,validUser.password)

        if(!validPass)
            {
                return next(errorHandler(400,'Wrong password'))
            }
        
        const {password:pass,...rest}=validUser._doc 

        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)

        res.status(200).cookie('access_token',token).json(rest)
    } catch (error) {
        next(error)
    }
}