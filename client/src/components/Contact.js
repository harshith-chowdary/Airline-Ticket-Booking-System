import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { statusupdate, successmail } from '../helper/helper';

import video from '../assets/vid4edit.mp4';
import style from '../styles/Home.module.css';
import styles from '../styles/bookingportal.css';

export default function Contact(){
    // statusupdate({ status : 'Cancelled'});

    return(
        <div className={style.home_container}>
            <video preload = "metadata" autoPlay loop className = {style.background_video}>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <Toaster position='top-center' reverseOrder={false}></Toaster>
            
            <div className='success_container'>
                <span className='above' style={{fontSize:"25px"}}>You <pspan style={{color:'green', fontSize:"30px"}}>CAN</pspan> contact us via <pspan style={{color:'green', fontSize:"30px"}}>EMAIL</pspan></span>
                <a href={`mailto:harnivikforyou@gmail.com`} style={{ color: "blue", fontSize: "30px", marginTop: 10 }}>harnivikforyou@gmail.com</a>
            </div>
        </div>
    )
}