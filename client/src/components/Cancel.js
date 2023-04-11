import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { statusupdate, successmail } from '../helper/helper';

import video from '../assets/vid3edit.mp4';
import style from '../styles/Home.module.css';
import styles from '../styles/bookingportal.css';

export default function Success(){

    const [updatestatus, setupdate] = useState(false);

    useEffect(() => {
        async function update() {
            try {
                await statusupdate({ status : "Cancelled"});
                setupdate(true);
            } catch (error) {
                console.error(error);
            }
        }
        update();

        localStorage.removeItem('booking');
    }, []);

    // statusupdate({ status : 'Cancelled'});

    return(
        <div className={style.home_container}>
            <video preload = "metadata" autoPlay loop className = {style.background_video}>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <Toaster position='top-center' reverseOrder={false}></Toaster>
            
            <div className='success_container'>
                <span className='above' style={{fontSize:"25px"}}>Your Booking is <pspan style={{color:'green', fontSize:"30px"}}>CANCELLED</pspan> by you.</span>
                <span className='below' style={{fontSize:"25px"}}>You <span style={{color:'green', fontSize:"30px"}}>CAN</span> Close this Page</span>
            </div>
        </div>
    )
}