import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { statusupdate, successmail, updatedffms } from '../helper/helper';

import video from '../assets/vid3edit.mp4';
import style from '../styles/Home.module.css';
import styles from '../styles/bookingportal.css';

export default function Success(){

    const navigate = useNavigate();

    useEffect(() => {
        updatedffms();
        successmail();

        async function update() {
            try {
                await statusupdate({ status : "Booked"});
            } catch (error) {
                console.error(error);
            }
        }
        update();

        setTimeout(() => {
            navigate('/booked');
        }, 1500);
    }, []);

    // const added = sessionStorage.getItem('added');
    // if(added==='NO'){
    //     updatedffms();
    //     sessionStorage.setItem('added', 'YES');
    // }

    return(
        <div className={style.home_container}>
            <video preload = "metadata" autoPlay loop className = {style.background_video}>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <Toaster position='top-center' reverseOrder={false}></Toaster>
            
            <div className='success_container'>
                <span className='above' style={{fontSize:"25px"}}>Your Booking is <pspan style={{color:'green', fontSize:"30px"}}>CONFIRMED</pspan></span>
                <span className='below' style={{fontSize:"25px"}}>You <span style={{color:'green', fontSize:"30px"}}>CAN</span> Close this Page</span>
                <span className='below' style={{marginTop:'10px', color:'dodgerblue'}}>Please check your Email(/s) for further Info and Invoice.</span>
            </div>
        </div>
    )
}