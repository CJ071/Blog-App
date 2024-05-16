import {Alert,Button,Select,TextInput,FileInput} from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL,ref,uploadBytesResumable,getStorage} from 'firebase/storage'
import {app} from '../firebase'
import { useState ,useEffect} from 'react'; 
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {useNavigate, useParams} from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function UpdatePost() {
    const {currentUser}=useSelector(state=>state.user)

    const [file,setFile]=useState(null)
    const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null)
    const [imageFileUploadError,setImageFileUploadError]=useState(null)
    const [formData,setFormData]=useState({})
    const [publishError,setPublishError]=useState(null)

    const {postId}=useParams()

    const navigate=useNavigate()

    useEffect(() => {
        
       const fetchpost=async()=>{
        try {
            const res=await fetch(`/api/post/getposts?postId=${postId}`)
            const data=await res.json()

            if(!res.ok)
            {
                setPublishError(data.message)
                return;
            }

            if(res.ok)
            {
                setPublishError(null)
                setFormData(data.posts[0])
            }
        }
         catch (error) {
            console.log(error.message)
            setPublishError(error.message)
        }
       }
       fetchpost()
    }, [postId]);

    const handleUploadImage=async()=>{
        if(!file)
        {
            setImageFileUploadError('Please upload the file')
            return;
        }

        try {
            setImageFileUploadError(null)
            const storage=getStorage(app)
            const fileName=new Date().getTime()+'-'+file.name
            const storageRef=ref(storage,fileName)
            const uploadTask=uploadBytesResumable(storageRef,file)

            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100
                    setImageFileUploadProgress(progress.toFixed(0))
                },
                (error)=>{
                    setImageFileUploadError('Image upload failed')
                    setImageFileUploadProgress(null)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl=>{
                        setImageFileUploadProgress(null)
                        setImageFileUploadError(null)
                        setFormData({...formData,image:downloadUrl})
                    })
                }
            )
        } catch (error) {
            setImageFileUploadError('Image upload failed')
            setImageFileUploadProgress(null)
            console.log(error)
        }
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const res=await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })

            const data=await res.json()
            console.log('data',data)
            if(!res.ok)
            {
               setPublishError(data.message)
               return 
            }

            if(res.ok)
            {
                setPublishError(null)
                navigate(`/post/${data.slug}`)

            }
        } catch (error) {
            setPublishError('Something went wrong')
        }
    }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>
        Update post
        </h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput
                type='text'
                placeholder='Title'
                required
                id='title'
                className='flex-1'
                onChange={(e)=>setFormData({...formData,title:e.target.value})}
                value={formData.title}
                />
                <Select onChange={(e)=>setFormData({...formData,category:e.target.value})} value={formData.category}>
                    <option value="Uncategorized">Select a Category</option>
                    <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                </Select>
            </div>

            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput 
                type='file' 
                accept='image/*'
                onChange={(e)=>setFile(e.target.files[0])}/>
                <Button 
                type='button' 
                gradientDuoTone='purpleToBlue' 
                size='sm' 
                outline
                onClick={handleUploadImage}
                disabled={imageFileUploadProgress}>
                       {imageFileUploadProgress?(
                        <div className='w-16 h-16'>
                            <CircularProgressbar
                            value={imageFileUploadProgress}
                            text={`${imageFileUploadProgress || 0}%`}
                            />
                        </div>
                       ):'Upload Image'}
                </Button>
            </div>
            {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
            {formData.image && <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
            />}
            <ReactQuill
            value={formData.content}
            theme='snow'
            placeholder='Write Something'
            className='h-72 mb-12'
            required
            onChange={(value)=>setFormData({...formData,content:value})}
            />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Update Post
                </Button>
                {publishError && (<Alert className='mt-5' color='failure' >
                    {publishError}
                </Alert>)}
        </form>
    </div>
  )
}
