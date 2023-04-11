import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';
import axios from 'axios';

import video from '../assets/vid3edit.mp4';
import styles from '../styles/Username.module.css';
import style from '../styles/Home.module.css';

export default function Register() {

  function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }

  const navigate = useNavigate()
  const [file, setFile] = useState()

  const formik = useFormik({
    initialValues : {
      email : '',
      username: '',
      password : ''
    },
    validate : registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      values = await Object.assign(values, { profile : file || ''})

      //console.log({values});
      
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading : <b>Processing ...</b>,
        success : <b>Register Successfully...!</b>,
        error : <span><b>Could not Register.</b><b> Both username and email must be unique.</b></span>
      });
      
      registerPromise.then(function(){ navigate('/profile')});
    }
  })

  // /** formik doensn't support file upload so we need to create this handler */
  // const onUpload = async e => {
  //   const base64 = await convertToBase64(e.target.files[0]);
  //   setFile(base64);
  // }

  const onUpload = async (event) => {
    let imageUrl = "";
    let image = event.target.files[0]
    if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "profilepics");
        const dataRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dv5kfqlnk/image/upload",
        formData
        );
        imageUrl = dataRes.data.url;
    }
    setFile(imageUrl)
    // return imageUrl;
  }

  return (
    <div className="container mx-auto">

      <video preload = "metadata" autoPlay loop className = {style.background_video}>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: "45%", paddingTop: '3em'}}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                Happy to join you!
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-4'>
                  <label htmlFor="profile">
                    <img src={file || avatar} className={styles.profile_img} alt="avatar" />
                  </label>
                  
                  <input style={{display:'none'}} onChange={onUpload} type="file" id='profile' name='profile' />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email*' />
                  <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username*' />
                  <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password*' />
                  <button className={styles.btn} type='submit'>Register</button>
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>Already Registered? <Link className='text-red-500' to="/login">Login Now</Link></span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}

