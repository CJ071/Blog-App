import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'

export const signup=async(req,res)=>{
    try {
        const {username,email,password}=req.body

        if(!username || !email || !password || username==='' || email==='' || password==='')
            {
                res.status(400).json({message:"All fields are required"})
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
        res.status(500).json({message:error.message})
    }
}