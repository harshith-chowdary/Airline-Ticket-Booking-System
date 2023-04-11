import React, { useState, useEffect, useMemo } from 'react';
import { getBookingData } from '../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import { findflight, findairport, findairline } from '../store/data.js';
import axios from 'axios';

import styles from '../styles/Username.module.css';
import style from '../styles/Home.module.css';
import infostyle from '../styles/details.css';

import video from '../assets/vid4edit.mp4';

export default function Booked() {

    localStorage.removeItem('booking');

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

    const { id, passengers, classs, departure, service, booking, count, discount } = flightData.booking;

    var [from, t1, to, t2] = findflight(service).nodes[0].split(' ');

    const duration = findflight(service).time;

    let ct = Number(count[0])+Number(count[2])+Number(count[4]);

    let height = 770 + ct*50;

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

    let discountPrice = totalPrice - discount;

    let pass = passengers.split(',');

    let passengers_blocks = [];

    passengers_blocks.push(
        <div className="row">
            <div className="cell" style={{width:'35%', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 50, color: 'cyan'}}>
                <span style={{textAlign: 'center', padding: 5, display: 'block'}}>Name</span>
            </div>
            <div className="cell" style={{width:'15%', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 50, color: 'cyan'}}>
                <span style={{textAlign: 'center', padding: 5, display: 'block'}} id="agegourp">Age</span>
            </div>
            <div className="cell" style={{width:'35%', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 50, color: 'cyan'}}>
                <span style={{textAlign: 'center', padding: 5, display: 'block'}} id="email">e-mail</span>
            </div>
            <div className="cell" style={{width:'15%', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 50, color: 'cyan', marginRight: 45}}>
                <span style={{textAlign: 'center', padding: 5, display: 'block'}} id="cowin">COWIN</span>
            </div>
        </div>
    )

    for(let i=0; i<pass.length; i++){

        let temp = pass[i].split('-');

        let name = temp[1];
        let age ='';
        let email = '';
        let cowin = 'N.A';

        if(temp[0]==='A') {
            age = 'Adult';
            email = temp[2];
            cowin = 'Passed';
        }
        else if(temp[1]==='K') age='Kid';
        else {
            age = 'Elder';
            email = temp[2];
            cowin = 'Passed';
        }

        passengers_blocks.push(
            <div className="row">
                <div className="cell" style={{width:'35%', padding: 3, backgroundColor: 'rgba(0, 255, 255, 0.2)'}}>
                    <span style={{textAlign: 'center', display: 'block'}}>{name}</span>
                </div>
                <div className="cell" style={{width:'15%', padding: 3, backgroundColor: 'rgba(0, 255, 255, 0.2)'}}>
                    <span style={{textAlign: 'center', display: 'block'}} id="agegourp">{age}</span>
                </div>
                <div className="cell" style={{width:'35%', padding: 3, backgroundColor: 'rgba(0, 255, 255, 0.2)'}}>
                    <span style={{textAlign: 'center', display: 'block'}} id="email">{email}</span>
                </div>
                <div className="cell" style={{width:'15%', padding: 3, backgroundColor: 'rgba(0, 255, 255, 0.2)', marginRight: 45}}>
                    <span style={{textAlign: 'center', color: 'green', display: 'block'}} id="cowin">{cowin}</span>
                </div>
            </div>
        )
    }

  return (
    <div className={style.container}>
        <video preload="metadata" autoPlay loop className={style.background_video}>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        <div className="flex justify-center items-center">
            {/* <div className={`${styles.glass} ${styles.form_container}`}> */}
            <div className="back" style={{height: height}}>
                <div className="title flex flex-col items-center">
                    <h4 className="text-5xl font-bold" style={{color: 'seagreen'}}>BOOKING CONFIRMED</h4>
                    <span className="py-4 text-xl w-2/3 text-center text-gray-500" style={{width: '100%'}}>
                    Please check your Mail(/s) for the Details of this Booking 
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
                            <div className="cell" style={{width:'50%'}}>
                                <small style={{textAlign: 'center', display: 'block'}}>Duration</small>
                                <span style={{textAlign: 'center', display: 'block'}}>{duration}</span>
                            </div>
                            <div className="cell" style={{width:'50%'}}>
                                <small style={{textAlign: 'center', display: 'block'}}>Class</small>
                                <span style={{textAlign: 'center', display: 'block'}} id="classs">{classs}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="cell" style={{width:'50%'}}>
                                <small style={{textAlign: 'center', display: 'block'}}>Departure</small>
                                <span style={{textAlign: 'center', display: 'block'}} id="depart">{departure}</span>
                            </div>
                            <div className="cell" style={{width:'50%'}}>
                                <small style={{textAlign: 'center', display: 'block'}}>Return</small>
                                <span style={{textAlign: 'center', display: 'block'}}>One Way</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="cell" style={{width:'50%'}}>
                                <small style={{textAlign: 'center', display: 'block'}}>Airline</small>
                                <span style={{textAlign: 'center', display: 'block'}}>{findairline(service.slice(0,2))}</span>
                            </div>
                            <div className="cell" style={{width:'50%'}}>
                                <small style={{textAlign: 'center', display: 'block'}}>Service</small>
                                <span style={{textAlign: 'center', display: 'block'}} id="service">{service}</span>
                            </div>
                        </div>

                        <div className="total" style={{fontSize:"18px"}}>
                            <small>ID</small>
                            <span style={{marginRight:"20px"}}>{id}</span>
                            <small>TOTAL</small> 
                            <span id="booking" style={{textAlign: 'left', marginRight:"20px"}}>&#8377;. {totalPrice.toFixed(2)}</span>
                            <small>DISCOUNT</small> 
                            <span id="gst" style={{textAlign: 'center', marginRight:"20px"}}>&#8377;. {discount.toFixed(2)}</span>
                            <small>FINAL</small> 
                            <span id="total" style={{textAlign: 'right'}}>&#8377;. {discountPrice.toFixed(2)}</span>
                        </div>

                        {passengers_blocks}

                        <div className="row">
                            <div className="cell" style={{width:'100%', padding: 3, marginRight: 40}}>
                                <span style={{textAlign: 'center', color:'red', display: 'block'}}>Gate Closing Time : 45 Minutes before Scheduled Departure of the Flight</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="cell" style={{width:'100%', padding: 3, fontFamily: 'Rock Salt', marginRight: 40}}>
                                <span style={{textAlign: 'center', font: 'Rock Salt', color:'yellow', display: 'block'}}>HAPPY JOURNEY :)</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
  )
}