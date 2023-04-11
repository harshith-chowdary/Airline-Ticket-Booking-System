import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/store'
import toast, { Toaster } from 'react-hot-toast';

import "../styles/bookingportal.css";
import '../styles/Username.module.css';
import style from "../styles/Home.module.css";

import video from '../assets/vid3edit.mp4';

export default function Booking() {

  function handleClick() {
    window.open("http://127.0.0.1:3055/design/index.html", "_blank");
  }

  return (
      <div className={style.home_container}>
          <video preload = "metadata" autoPlay loop className = {style.background_video}>
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
          </video>

          <Toaster position='top-center' reverseOrder={false}></Toaster>
          
          <div className='home_container' style={{padding: 60}}>
              <span className='above'>To continue to the <span style={{color: 'green'}}>BOOKING PORTAL</span></span>
              <button className='button-29' onClick={handleClick} style={{marginTop: 10, marginBottom: 10}}>Click Here</button>
              <span className='below'><span style={{color: 'red'}}>CAUTION</span> , you'll be redirected to a new Page !!!</span>
          </div>
      </div>
  );
}