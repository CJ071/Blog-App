import {Alert,Button,Select,TextInput,FileInput} from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL,ref,uploadBytesResumable,getStorage} from 'firebase/storage'
import {app} from '../firebase'
import { useState } from 'react'; 
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function CreatePost() {
    const [file,setFile]=useState(null)
    const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null)
    const [imageFileUploadError,setImageFileUploadError]=useState(null)
    const [formData,setFormData]=useState({})

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

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>
        Create a post
        </h1>
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput
                type='text'
                placeholder='Title'
                required
                id='title'
                className='flex-1'
                />
                <Select>
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
            theme='snow'
            placeholder='Write Something'
            className='h-72 mb-12'
            required
            />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Publish
                </Button>

        </form>
    </div>
  )
}
