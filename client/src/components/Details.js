import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBookingData, submitDetails } from '../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import { findflight, findairport, findairline } from '../store/data.js';
import convertToBase64 from '../helper/convert';
import { useFormik } from 'formik';
import axios from 'axios';

import styles from '../styles/Username.module.css';
import style from '../styles/Home.module.css';
import infostyle from '../styles/details.css';

import video from '../assets/vid4edit.mp4';

export default function Details() {

    const navigate = useNavigate();
    
    let initialValues = {}

    const formik = useFormik({
        initialValues : initialValues,
        // validate : detailsValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            toast.success('Submitted Details!')
            values = await Object.assign(values, {id: id, kid: kid, adult: adult, elder: elder})

            console.log({values});
            
            let submitPromise = submitDetails(values)
            toast.promise(submitPromise, {
            loading : <b>Processing ...</b>,
            success : <b>You'll be redirected shortly don't close or refresh the Page.</b>,
            error : <b>Could not submit Details.</b>
            });

            submitPromise.then(function(){ navigate('/verify') })
        }
      })

    /* to convert to base64 Payload too large rror */
    // const onUpload = async (event) => {
    //     const base64 = await convertToBase64(event.target.files[0]);
    //     return base64;
    // }

    const onUpload = async (event) => {
        let imageUrl = "";
        let image = event.target.files[0]
        if (image) {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "cowins");
            const dataRes = await axios.post(
            "https://api.cloudinary.com/v1_1/dv5kfqlnk/image/upload",
            formData
            );
            imageUrl = dataRes.data.url;
        }
        return imageUrl;
    }

    const [flightData, setFlightData] = useState(null);          

    useEffect(() => {
        async function fetchFlightData() {
            try {
                const response = await getBookingData();
                const data = response.data;

                const bookingtoken = response.token;

                localStorage.setItem('booking', bookingtoken);
                setFlightData(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchFlightData();
    }, []);

    if (!flightData) {
        return <div>Loading...</div>;
    }

    const { id, passengers, classs, departure, service, booking, count } = flightData.booking;

    var [from, t1, to, t2] = findflight(service).nodes[0].split(' ');

    var time1 = new Date(t1),
			time2 = new Date(t2);
    
    let bookingPrice = parseFloat(booking);

    let gstPrice =  bookingPrice * 0.05;

	if(classs==='Business'){
		gstPrice = bookingPrice*0.12;
	}
	else if(classs==='First Class'){
		gstPrice = bookingPrice*0.18;
	}

	let totalPrice = bookingPrice + gstPrice;

    const types = count.split(',')

    let adult = types[0];
    let kid = types[1];
    let elder = types[2];

    let lmao = []
    if(adult>0) lmao.push(`${adult} Adults`);
    if(kid>0) lmao.push(`${adult} Kids`);
    if(elder>0) lmao.push(`${adult} Elders`);

    let Passengers = lmao.join(', ');

    // const types = passengers.split(', ');

    // let kid = 0;
    // let adult = 0;
    // let elder = 0;

    // types.forEach(element => {
    //     const pas = element.split(' ');
    //     if(pas[1]==="Adults") adult = pas[0];
    //     else if(pas[1]==="Kids") kid = pas[0];
    //     else elder = pas[0];
    // });
    
    const passengers_blocks = [];

    let gap = "100px"

    if(kid>0 && adult>0 && elder>0){
        gap = "140px"
    }

    let i
    
    //adult details
    if (adult > 0) {
        passengers_blocks.push(<h2 style={{marginTop:"30px", fontSize:"20px"}}>Adults Details</h2>)
        
        for (i = 0 ; i<adult; i++) {
            initialValues[`adultname${i + 1}`] = '';
            initialValues[`adultemail${i + 1}`] = '';
            initialValues[`adultphone${i + 1}`] = '';
            initialValues[`adultffm${i + 1}`] = false;
            const cowin = `adultcowin${i+1}`
            passengers_blocks.push(
                <div>
                        <div key={`adult${i + 1}`} className="passenger-details">
                            <label>Name :</label>
                            <input {...formik.getFieldProps(`adultname${i + 1}`)} type="text" name={`adultname${i + 1}`} placeholder='Name' required/>
    
                            <label>Email :</label>
                            <input {...formik.getFieldProps(`adultemail${i + 1}`)} type="email" name={`adultemail${i + 1}`} placeholder='Email' required/>

                            <label>Phone :</label>
                            <input {...formik.getFieldProps(`adultphone${i + 1}`)} type="tel" name={`adultphone${i + 1}`} pattern ="[0-9]{10}" placeholder='8985847358' required/>
    
                            <label>CoWin QR Image :</label>
                            <input onChange={async (event) => {formik.setFieldValue(cowin, await onUpload(event));}} type="file" name={`adultcowin${i + 1}`} accept="image/jpeg" required/>

                            <label>Wanna use your FFMs ?</label>
                            <input {...formik.getFieldProps(`adultffm${i + 1}`)} type="checkbox" name={`adultffm${i + 1}`}/>
                        </div>
                </div>
            );
        }
    }

    //kid details
    if(kid > 0){
        passengers_blocks.push(<h2 style={{marginTop:"30px", fontSize:"20px"}}>Kid Details</h2>)

        for (i = 0 ; i<kid; i++) {
            initialValues[`kidname${i + 1}`] = '';
            // initialValues[`kidemail${i + 1}`] = '';
            // const cowin = `kidcowin${i+1}`
            passengers_blocks.push(
                <div>
                        <div key={`kid${i + 1}`} className="passenger-details">
                            <label>Name :</label>
                            <input {...formik.getFieldProps(`kidname${i + 1}`)} type="text" name={`kidname${i + 1}`} placeholder='Name' required/>
    
                            {/* <label>Email :</label>
                            <input {...formik.getFieldProps(`kidemail${i + 1}`)} type="email" name={`kidemail${i + 1}`} placeholder='Email' required/> */}
    
                            {/* <label>CoWin QR Image :</label>
                            <input onChange={async (event) => {formik.setFieldValue(cowin, await onUpload(event));}} type="file" name={`kidcowin${i + 1}`} accept="image/jpeg" required/> */}
                        </div>
                </div>
            );
        }
    }

    
    //elder details
    if (elder > 0) {
        passengers_blocks.push(<h2 style={{marginTop:"30px", fontSize:"20px"}}>Elders Details</h2>)
        
        for (i = 0 ; i<elder; i++) {
            initialValues[`eldername${i + 1}`] = '';
            initialValues[`elderemail${i + 1}`] = '';
            initialValues[`elderphone${i + 1}`] = '';
            initialValues[`elderffm${i + 1}`] = false;
            const cowin = `eldercowin${i+1}`
            passengers_blocks.push(
                <div>
                        <div key={`elder${i + 1}`} className="passenger-details">
                            <label>Name :</label>
                            <input {...formik.getFieldProps(`eldername${i + 1}`)}type="text" name={`eldername${i + 1}`} placeholder='Name' required/>
    
                            <label>Email :</label>
                            <input {...formik.getFieldProps(`elderemail${i + 1}`)}type="email" name={`elderemail${i + 1}`} placeholder='Email' required/>
    
                            <label>Phone :</label>
                            <input {...formik.getFieldProps(`elderphone${i + 1}`)} type="tel" name={`elderphone${i + 1}`} pattern ="[0-9]{10}" placeholder='8985847358' required/>

                            <label>CoWin QR Image :</label>
                            <input onChange={async (event) => {formik.setFieldValue(cowin, await onUpload(event));}} type="file" name={`eldercowin${i + 1}`} accept="image/jpeg" required/>

                            <label>Wanna use your FFMs ?</label>
                            <input {...formik.getFieldProps(`elderffm${i + 1}`)} type="checkbox" name={`elderffm${i + 1}`}/>
                        </div>
                </div>
            );
        }
    } 

  return (
    <div className={style.container}>
        <video preload="metadata" autoPlay loop className={style.background_video}>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        <div className="flex justify-center items-center">
            {/* <div className={`${styles.glass} ${styles.form_container}`}> */}
            <div className="back">
                <div className="title flex flex-col items-center">
                    <h4 className="text-5xl font-bold">Passenger Details</h4>
                    <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                    Please fill in the details below for each person and upload their CoWin Certificate
                    </span>
                </div>

                <div className="ticket">
                    <section style={{fontSize : "20px"}}>
                        <div className="title">
                            <div>
                                <small>{time1.toLocaleTimeString().replace(':00','')}</small>
                                <span>{from}</span>
                                <small>{findairport(from)}</small>
                            </div>
                            {/* <span className="separator"><i className="zmdi zmdi-airplane"></i></span> */}
                            <span className='separator' style={{marginTop:"40px"}}><svg xmlns="http://www.w3.org/2000/svg" width="43.2" height="40.8" viewBox="0 0 432 408"><g transform="rotate(90 216 216)"><path fill="currentColor" d="M175 152zm230 149l-170-53v117l42 32v32l-74-21l-75 21v-32l43-32V248L0 301v-42l171-107V35q0-14 9-23t22.5-9t23 9t9.5 23v117l170 107v42z"/></g></svg></span>
                            <div>
                                <small>{time2.toLocaleTimeString().replace(':00','')}</small>
                                <span>{to}</span>
                                <small>{findairport(to)}</small>
                            </div>
                        </div>
                        <div className="row">
                            <div className="cell">
                                <small>Passengers</small>
                                <span id="passengers">{Passengers}</span>
                            </div>
                            <div className="cell">
                                <small>Class</small>
                                <span id="classs">{classs}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="cell">
                                <small>Departure</small>
                                <span id="depart">{departure}</span>
                            </div>
                            <div className="cell">
                                <small>Return</small>
                                <span>One Way</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="cell">
                                <small>Airline</small>
                                <span>{findairline(service.slice(0,2))}</span>
                            </div>
                            <div className="cell">
                                <small>Service</small>
                                <span id="service">{service}</span>
                            </div>
                        </div>

                        <div className="total" style={{fontSize:"18px"}}>
                            <small>ID</small>
                            <span style={{marginRight:"20px"}}>{id}</span>
                            <small>BOOKING</small> 
                            <span id="booking" style={{textAlign: 'left', marginRight:"20px"}}>&#8377;. {bookingPrice.toFixed(2)}</span>
                            <small>GST</small> 
                            <span id="gst" style={{textAlign: 'center', marginRight:"20px"}}>&#8377;. {gstPrice.toFixed(2)}</span>
                            <small>TOTAL</small> 
                            <span id="total" style={{textAlign: 'right'}}>&#8377;. {totalPrice.toFixed(2)}</span>
                        </div>
                    </section>
                </div>

                <form style={{marginTop:gap}} onSubmit={formik.handleSubmit}>
                    <span className='Caution'>DISCLAIMER : Kindly hold on after Submitting Response.</span>
                    <div id="passenger-form">
                        {passengers_blocks}
                        <span className='Caution'>TIP: You can re-fill the form entirely by Refreshing the Page.</span>
                        <button className={styles.btn} style={{marginLeft:"75px", marginTop:"20px"}} type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}