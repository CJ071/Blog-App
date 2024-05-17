import express from 'express'
import { getUsers,updateUser,deleteUser,signout } from '../controllers/user.controller.js'
import { verifyUser } from '../utils/verifyUser.js'

const router=express.Router()

router.get('/getUsers',verifyUser,getUsers)
router.put('/update/:userId',verifyUser,updateUser)
router.delete('/delete/:userId',verifyUser,deleteUser)
router.post('/signout',signout)

export default router