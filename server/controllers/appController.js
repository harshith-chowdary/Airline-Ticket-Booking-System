import UserModel from '../model/User.model.js';
import BookingModel from '../model/Booking.model.js';
import PassengerModel from '../model/Passenger.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';
import {v4 as uuidv4} from 'uuid';
import { setActiveUser, getActiveUser, setActiveBooking, getActiveBooking, setActiveVerify, getActiveVerify, setBookingInfo, getBookingInfo, setuseffms, getuseffms, setisftf, getisftf } from '../serverdata.js';
import { spawn } from 'child_process';

import { findflight, findairline, findairport } from '../flightdata.js';

import stripepay from 'stripe';
const stripe = stripepay(ENV.STRIPE_PRIVATE_KEY);

/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req,res){

    try {
        const { username, password, profile, email } = req.body;        

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"});

                resolve();
            })
        }).catch(error => {
            console.log("existUsername promise rejected: ", error);
            return res.status(500).send({ error : "Please use unique username"})
        });

        // check for existing email
        const existEmail = await new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, email){
                if(err) reject(new Error(err))
                if(email) reject({ error : "Please use unique Email"});

                resolve();
            })
        }).catch(error => {
            console.log("existEmail promise rejected: ", error);
            return res.status(500).send({ error : "Please use unique Email"})
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10)
                        .then( hashedPassword => {
                            
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                                .catch(error => res.status(500).send({error}))

                            setActiveUser(username);

                        }).catch(error => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ error })
            })

    } catch (error) {
        return res.status(500).send(error);
    }

}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req,res){
   
    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET , { expiresIn : "24h"});

                        // To set the data
                        // sessionStorage.setItem('username', user.username);

                        setActiveUser(username);

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });                                    

                    })
                    .catch(error =>{
                        return res.status(400).send({ error: "Password does not Match"})
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error});
    }
}


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    
    const { username } = req.params;

    try {
        
        if(!username) return res.status(501).send({ error: "Invalid Username"});

        UserModel.findOne({ username }, function(err, user){
            if(err) return res.status(500).send({ err });
            if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        })

    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
    }

}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req,res){
    try {
        
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const body = req.body;

            // emails the data
            UserModel.updateOne({ _id : userId }, body, function(err, data){
                if(err) throw err;

                return res.status(201).send({ msg : "Record Updated...!"});
            })

        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
   if(req.app.locals.resetSession){
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Session expired!"})
}


// emails the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    try {
        
        if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

        const { username, password } = req.body;

        try {
            
            UserModel.findOne({ username})
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username : user.username },
                            { password: hashedPassword}, function(err, data){
                                if(err) throw err;
                                req.app.locals.resetSession = false; // reset session
                                return res.status(201).send({ msg : "Record Updated...!"})
                            });
                        })
                        .catch( e => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error : "Username not Found"});
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}

export async function postdata(req, res){
    try{
        const {passengers, classs, departure, service, booking, status} = req.body;

        const time = new Date().toJSON();
        const id = `${getActiveUser()}@${time}`

        setActiveBooking(id);
        setBookingInfo(passengers);

        let ct = [0, 0, 0]

        let list = passengers.split(', ');
        for(let i=0; i<list.length; i++){
            let temp = list[i].split(' ');
            if(temp[1]==='Adults'){
                ct[0]=temp[0]
            }
            else if(temp[1]==='Kids'){
                ct[1]=temp[0]
            }
            else if(temp[1]==='Elders'){
                ct[2]=temp[0]
            }
        }

        const count = ct.join(',');

        const discount = 0

        const book = new BookingModel({
            id, passengers, classs, departure, service, booking, count, status, discount
        });

        console.log(book);
        book.save()
            .then(result => res.status(201).send({ msg: "Booking Successful ...!"}))
            .catch(error => res.status(500).send({error}))
    }
    catch (error){
        return res.status(401).send({ error })
    }
}

export async function getdata(req, res){
    try{

        const bid = getActiveBooking();
        console.log(`GET : ${bid}`)

        // create jwt token
        const active = jwt.sign({
            username : getActiveUser(),
            bookingId: bid,
        }, ENV.JWT_SECRET , { expiresIn : "10m" });

        console.log(`Set active token : ${active}`);

        await BookingModel.findOne({ id: bid })
            .then(booking => {
                return res.status(201).send({ msg : "Got Data...!", data: {booking}, token: active})
        })
        .catch( error => {
            return res.status(404).send({ error : "Booking Id not Found"});
        })
    }
    catch (error){
        return res.status(401).send({ error })
    }
}

export async function updateDetails(req, res){
    try{
        const values = req.body;

        let passeng = [];
        let verify = [];

        let tffm = 0;

        let i;

        let useffms = '';

        let isftf = '';
        
        for (i = 1; i <= values.adult; i++) {
            const adultName = values[`adultname${i}`];
            const adultEmail = values[`adultemail${i}`];
            const adultCowin = values[`adultcowin${i}`];
            const adultPhone = values[`adultphone${i}`];
            const adultffm = values[`adultffm${i}`];

            await PassengerModel.findOne({ email: adultEmail })
            .then(Passenger => {
                if(adultffm){
                    tffm += Number(Passenger.ffm);
                    useffms += '1';
                }
                else{
                    useffms += '0';
                }
                console.log("Found");

                isftf += '0';
            })
            .catch( error => {
                let ffm = 0
                const pas = new PassengerModel({
                    name : adultName, email: adultEmail, phone: adultPhone, ffm
                });
        
                console.log(pas);
                pas.save()
                    .then(result => console.log("Passenger Added ...!"))
                    .catch(error => console.log("Passenger NOT Added ...!"))

                isftf += '1';
            })
        
            passeng.push(`A-${adultName}-${adultEmail}-${adultCowin}`);
            verify.push(`${adultName}-${adultCowin}`);
        }

        for (i = 1; i <= values.kid; i++) {
            const kidName = values[`kidname${i}`];
        
            passeng.push(`K-${kidName}`);
        }
        
        for (i = 1; i <= values.elder; i++) {
            const elderName = values[`eldername${i}`];
            const elderEmail = values[`elderemail${i}`];
            const elderCowin = values[`eldercowin${i}`];
            const elderPhone = values[`elderphone${i}`];
            const elderffm = values[`elderffm${i}`];

            await PassengerModel.findOne({ email: elderEmail })
            .then(Passenger => {
                if(elderffm){
                    useffms += '1';
                    tffm = tffm + Number(Passenger.ffm);
                }
                else{
                    useffms += '0';
                }
                console.log("Found");

                isftf += '0';
            })
            .catch( error => {
                let ffm = 0
                const pas = new PassengerModel({
                    name: elderName, email: elderEmail, phone: elderPhone, ffm
                });
        
                console.log(pas);
                pas.save()
                    .then(result => console.log("Passenger Added ...!"))
                    .catch(error => console.log("Passenger NOT Added ...!"))

                isftf += '1';
            })

            passeng.push(`E-${elderName}-${elderEmail}-${elderCowin}`);
            verify.push(`${elderName}-${elderCowin}`);
        }

        setuseffms(useffms);
        setisftf(isftf);

        console.log(`ffms = ${useffms}`);
        console.log(`ftf = ${isftf}`);

        let discount = tffm*0.1

        // console.log(values)

        const updatedpassengers = passeng.join(',');
        // const verifydata = '"'+verify.join(',')+'"';
        const verifydata = verify.join(',');
        setActiveVerify(verifydata);
        console.log(verifydata)

        // console.log(updatedpassengers)

        // console.log(`discount = ${discount}`)

        await BookingModel.findOne({ id: values.id})
            .then(booking => {
                BookingModel.updateOne({ id: booking.id}, { passengers : updatedpassengers}, function(err, data){
                    if(err) throw err;
                })
                BookingModel.updateOne({ id: booking.id}, { discount : discount}, function(err, data){
                    if(err) throw err;
                    return res.status(201).send({ msg : "Updated...!"})
                })
            }
        )
    }
    catch(error){
        return res.status(401).send({error})
    }
}

// to verify certificates in background
export async function verifycertificates(req, res){
    try{
        
        let passen = getActiveVerify();

        console.log(passen)

        try{

            const pythonProcess = spawn('python', ['../multi_verify_auto.py', passen]);

            // Collect the output of the Python script
            let output = '';

            // Handle standard output from the Python script
            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            console.log(output)
            // Handle the exit event from the Python script
            pythonProcess.on('exit', (code) => {
                console.log(`child process exited with code ${code}`);
                if (code === 0) {
                    // If the Python script exited successfully, return the output to the client
                    return res.status(201).send({ msg: "Verification Process Complete", data: output })
                } else {
                    // If the Python script exited with an error, return an error response to the client
                    return res.status(405).send({ error: "Verification Process Failed" })
                }
            });

        }catch (error){

            // const bid = getActiveBooking()
            // const info = getBookingInfo()

            // BookingModel.findOne({ id: bid})
            // .then(booking => {
            //     BookingModel.updateOne({ id: bid}, { passengers : info}, function(err, data){
            //         if(err) throw err;
            //         // return res.status(405).send({ msg : "Passengers Change Reverted...!"})
            //     })
            // })
            return res.status(405).send({ error: error.message })
        }

    }
    catch (error){
        return res.status(401).send({ error: error.message })
    }
}

// to emails status of booking after verification of certificates
export async function updatestatus(req, res){
    try{
        console.log('Update status entered');

        const bid = getActiveBooking();
        console.log(`GET : ${bid}`)

        const status = req.body['status'];
        // if(status==='Booked' || status==='Failed' || status==='Cancelled'){
        //     setActiveVerify('');
        //     setBookingInfo('');
        //     setuseffms('');
        //     setisftf('');
        //     setActiveBooking('');
        // }

        BookingModel.findOne({ id: bid})
        .then(booking => {

            let ct = booking.count.split(',')
            let count = Number(ct[0])+Number(ct[2]);

            let cowin
            if(status==='Verified'){
                cowin = "1".repeat(count);
            }
            else if(status==='Rejected'){
                const info = req.body['info'];

                console.log(info)

                cowin = "1".repeat(info[5]);
                cowin += info[0];

                cowin += "0".repeat(count - info[5] - 1);
            }

            if(status==='Verified' || status==='Rejected'){
                BookingModel.updateOne({ id: bid}, { cowin : cowin }, function(err, data){
                    if(err) throw err;
                    console.log("COWIN Verify Updated...!")
                })
            }

            BookingModel.updateOne({ id: bid}, { status : status }, function(err, data){
                if(err) throw err;
                console.log('Update status exit')
                return res.status(201).send({ msg : "Status Updated...!"})
            })
        })
    }
    catch(error){
        return res.status(401).send({error})
    }
}

// to link payment portal
export async function payment(req, res){
    try{
        const bid = getActiveBooking();
        console.log(`GET : ${bid}`)

        const info = getBookingInfo();

        let book_details
        await BookingModel.findOne({ id: bid})
        .then(booking => {
            book_details = booking
        })

        let gst = book_details.booking
        let per
        if(book_details.classs==='Economy'){
            per = 0.05
        }
        else if(book_details.classs==='Business'){
            per = 0.12
        }
        else{
            per = 0.18
        }

        gst = gst*per
        per = per*100

        let dis = book_details.discount.toFixed(2);

        let final_amount = (book_details.booking - dis).toFixed(2);

        // console.log(`discount = ${dis}`);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `${book_details.classs} - ${info} incl. FFM Discount : INR ${dis}`,
                        },
                        unit_amount: final_amount * 100, // Stripe requires amounts to be in paise
                    },
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `GST - ${per}%`,
                        },
                        unit_amount: Math.round(gst * 100) // Stripe requires amounts to be in paise
                    },
                    quantity: 1,
                },
            ],
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        })
        res.status(201).send({ url: session.url })
    }
    catch (error){
        console.error(error)
        res.status(401).send({error: error.message})
    }
}


// to update ffms Completion of Booking 
export async function updateffms(req, res){

    try{

        const useffms = getuseffms();
        const isftf = getisftf();

        let Passengers
        let service

        const bid = getActiveBooking();

        await BookingModel.findOne({ id: bid})
        .then(booking => {
            Passengers = booking.passengers;
            service = booking.service;
        })

        let addffm = findflight(service).miles*0.2;

        let divided = Passengers.split(',');

        let emails = []

        for(let i=0; i<divided.length; i++){

            let indi = divided[i].split('-');

            if(indi[0]!=='K'){
                emails.push(indi[2]);
            }
        }

        // console.log(emails);
        // console.log(useffms);

        for(let i=0; i<emails.length; i++){

            await PassengerModel.findOne({ email: emails[i]})
            .then(passen => {

                let finalffm
                if(useffms[i]==='1' || isftf[i]==='1'){
                    finalffm = addffm;
                }
                else{
                    finalffm = passen.ffm + addffm;
                }

                console.log(finalffm);
                PassengerModel.updateOne({ email: emails[i]}, { ffm: finalffm }, function(err, data){
                    if(err) throw err;
                })
            })
        }

        return res.status(201).send({ msg : "FFMs Updated...!"})
    }
    catch (error){
        console.error(error)
        res.status(401).send({error: error.message})
    }
}