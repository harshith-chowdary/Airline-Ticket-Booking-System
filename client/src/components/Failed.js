import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { statusupdate, rejectedmail } from '../helper/helper';
import { useLocation } from 'react-router-dom';

import video from '../assets/vid2.mp4';
import style from '../styles/Home.module.css';
import styles from '../styles/bookingportal.css';

export default function Failed(){

    const location = useLocation();
    const info = location.info;

    localStorage.removeItem('booking');

    return(
        <div className={style.home_container}>
            <video preload = "metadata" autoPlay loop className = {style.background_video}>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <Toaster position='top-center' reverseOrder={false}></Toaster>
            
            <div className='success_container'>
                <span className='above' style={{fontSize:"25px"}}>Your Booking has been <pspan style={{color:'green', fontSize:"30px"}}>REVOKED</pspan></span>
                <span className='below' style={{fontSize:"25px"}}>One or more of <span style={{color:'red', fontSize:"30px"}}>COWIN</span> Certificates have been found <span style={{color:'red', fontSize:"30px"}}>NOT</span> Trusty</span>
                <span className='below' style={{marginTop:'10px', color:'dodgerblue'}}>Please re-check your Certificates(/s).</span>
            </div>
        </div>
    )
}