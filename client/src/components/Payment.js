import React, { useState, useEffect } from 'react';
import { payment }  from '../helper/helper';
import style from '../styles/bookingportal.css'
import toast, { Toaster } from 'react-hot-toast';

export default function Payment(){

    const [url, seturl] = useState(null)

    useEffect(() => {
        async function fetchurl() {
            try {
                const response = await payment();
                console.log(response)
                const url = response.data.url;
                seturl(url);
            } catch (error) {
                console.error(error);
            }
        }
        fetchurl();
    }, []);

    console.log(`URL : ${url}`)

    // https://stripe.com/docs/testing#international-cards // Test Cards by Country Data

    if(url!==null && url!==undefined){
        window.location = url
    }

    return(
        <div className="lol">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className="home_container">
                <span className='above' style={{fontSize:"25px"}}>Your Certificate Verification is <pspan style={{color:'green', fontSize:"30px"}}>SUCCESSFUL</pspan></span>
                <span className='below' style={{fontSize:"25px"}}><span style={{color:'red', fontSize:"30px"}}>DONOT</span> Refresh or close this Page</span>
                <span className='below' style={{marginTop:'10px', color:'dodgerblue'}}>FINISH your payment within 10 minutes</span>
            </div>
        </div>
    )
}