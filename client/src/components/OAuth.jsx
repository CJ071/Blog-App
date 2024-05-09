import { Button } from 'flowbite-react'
import React from 'react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {GoogleAuthProvider,signInWithPopup,getAuth} from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import {app} from '../firebase'
import { signInSuccess } from '../redux/user/userSlice'


export default function OAuth() {
    const auth=getAuth(app)
    const navigate=useNavigate()
    const dispatch=useDispatch()

    const handleGoogleClick=async()=>{

        const provider=new GoogleAuthProvider()
        provider.getCustomParameters({prompt:'select_account'})
        try {
            const resultsFromGoogle=await signInWithPopup(auth,provider)
            const res=await fetch('/api/auth/google',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    username:resultsFromGoogle.user.displayName,
                    email:resultsFromGoogle.user.email,
                    googlePhotoUrl:resultsFromGoogle.user.photoURL
                })
            })

            const data=await res.json()
            console.log(resultsFromGoogle)

            if(res.ok)
            {
                dispatch(signInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-6'/>
        Continue with Google
    </Button>
  )
}
