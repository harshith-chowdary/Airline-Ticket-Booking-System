import React, { useState, useEffect } from 'react';
import style from '../styles/bookingportal.css'
import { Link, useNavigate } from 'react-router-dom';
import { verify, statusupdate } from '../helper/helper';
import toast, { Toaster } from 'react-hot-toast';

export default function Verify(){

    const navigate = useNavigate();

    const [verifystatus, setverify] = useState(null);

    useEffect(() => {
        async function fetchverify() {
            try {
                const response = await verify();
                const data = response.data;
                setverify(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchverify();
    }, []);

    if(verifystatus!==null){

        console.log(verifystatus.data);

        let pass
        if(verifystatus.data==='Success'){
            toast.success('Verification Check Successfull!')
            sessionStorage.setItem('added', 'NO');
            pass='Verified'
            statusupdate({ status : pass});

            setTimeout(() => {
                navigate('/payment')
            }, 0);
        }
        else{
            toast.error('Verification Check Failed!')
            pass='Rejected'
            let info = verifystatus.data
            statusupdate({ status : pass, info: info});
            setTimeout(() => {
                navigate('/failed', {info : info})
            }, 0);
        }
    }

    return(
        <div className="lol">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className="home_container">
                <span className='above' style={{fontSize:"25px"}}>We are Verifying your <pspan style={{color:'green', fontSize:"30px"}}>COWIN</pspan>Certificates</span>
                <span className='below' style={{fontSize:"25px"}}><span style={{color:'red', fontSize:"30px"}}>DONOT</span> Close this Page</span>
                <span className='below' style={{marginTop:'10px', color:'dodgerblue'}}>You'll be redirected shortly</span>
                <span className='below' style={{fontSize:"25px"}}><span style={{color:'green', fontSize:"30px"}}>REFRESH</span> if IDLE for too long.</span>
            </div>
        </div>
    )
}