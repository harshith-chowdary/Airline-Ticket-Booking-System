import React from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import style from '../styles/Home.module.css';

import video from '../assets/home.mp4';

export default function Home() {

  return (
    <div className = {style.home_container} style={{"fontFamily":'Rock Salt'}}>

      <video autoPlay loop className = {style.background_video}>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Toaster position='top-center' reverseOrder={false}></Toaster>
    </div>
  );
}