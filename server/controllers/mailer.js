import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';
import { getActiveUser, setActiveBooking, getActiveBooking, setisftf, getisftf, getActiveVerify } from '../serverdata.js';
import { findflight, findairline, findairport } from '../flightdata.js';
import BookingModel from '../model/Booking.model.js';
import PassengerModel from '../model/Passenger.model.js';
import UserModel from '../model/User.model.js';

// https://ethereal.email/create
let nodeConfig = {
    service : 'gmail',
    // host: ENV.SMTP_HOST,
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
        user: ENV.SMTP_USERNAME,
        pass: ENV.SMTP_PASSWORD,
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "HarNiVik Airline Services",
        link: 'http://localhost:3000/home'
    }
});

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : ""
}
*/
export const registerMail = async (req, res) => {
    const { username, userEmail, firstName, text, subject } = req.body;

    // body of the email
    const email = {
        body : {
            name: firstName || username,
            intro : text || `Welcome to HarNiVik Airline Services! We\'re very excited to have you on board.`,
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    const emailBody = MailGenerator.generate(email);
    const emailText = MailGenerator.generatePlaintext(email);

    let emailOptions = {
        from : `HarNiVik Airline Services <${ENV.SMTP_USERNAME}>`,
        to: userEmail,
        subject : subject || "Welcome to HarNiVik Airline Services :)",
        text: emailText,
        html: emailBody
    }

    // send mail
    transporter.sendMail(emailOptions)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from us."})
        })
        .catch(error => res.status(500).send({ error }))
}


// send SUCCESS Mail containing all the details
export const successMail = async (req, res) => {

    console.log('Success Mail called');
    const username = getActiveUser();
    const bid = getActiveBooking();

    let book_details
    await BookingModel.findOne({ id: bid})
    .then(booking => {
        book_details = booking
    })

    let user
    await UserModel.findOne({ username : username})
    .then(userin => {
        user = userin
    })

    const flight = findflight(book_details.service);

    let [from, t1, to, t2] = flight.nodes[0].split(' ');

    // let time1 = new Date(t1);
    // let time2 = new Date(t2);

    // function subtractMinutes(date, minutes) {
    //     const datecopy = new Date(date);
    //     datecopy.setMinutes(date.getMinutes() - minutes);
    //     return datecopy;
    // }
      
    // const gateclose = new Date(time1);
    // // console.log(gateclose);
    // gateclose.setMinutes(gateclose.getMinutes() - 45);

    let depart_time = t1.slice(11,16);
    let arrival_time = t2.slice(11,16);

    // let gateclose_time = gateclose.toString().slice(11,16);

    const passengers_bookin = book_details.passengers.split(',');
    let pass = []

    let tomail = []

    for(let i=0; i<passengers_bookin.length; i++){
        let temp = passengers_bookin[i].split('-');

        console.log(temp[1]);

        pass.push(temp[1]);
        tomail.push(temp[2]);
    }

    const fpass = pass.join(', '); 

    // body of the email
    const email = {
        // body : {
        //     name: user.firstName || username,
        //     intro: `Booking Confirmed !!, Hurray can't wait to fly with you :)<br>
        //     Here are the details of your Booking and some Instructions :<br><br>
        //     Booking Id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${bid}<br>
        //     From&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${findairport(from)}<br>
        //     To&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${findairport(to)}<br>
        //     Passengers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${fpass}<br>
        //     Date of Travel&nbsp;&nbsp;: ${book_details.departure}<br>
        //     Deparure Time&nbsp;&nbsp;&nbsp;: ${depart_time} IST<br>
        //     Arrival Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${arrival_time} IST<br>
        //     COWIN Verify Status : ${book_details.cowin}<br><br>
        //     Gate closes 45 minutes before Scheduled Departure Time.<br><br>`,
        //     outro: 'Need help, or have any queries? Just reply to this email, we\'d love to help.'
        // }

        body: {
            name: user.firstName || username,
            intro: `Booking Confirmed !!, Hurray can't wait to fly with you :)<br>
            Here are the details of your Booking and some Instructions :<br><br>
            <table style="border-collapse: collapse;">
                <tr>
                <td style="border: 1px solid black; padding: 5px;">Booking Id</td>
                <td style="border: 1px solid black; padding: 5px;">${bid}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 5px;">From</td>
                <td style="border: 1px solid black; padding: 5px;">${findairport(from)}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 5px;">To</td>
                <td style="border: 1px solid black; padding: 5px;">${findairport(to)}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 5px;">Passengers</td>
                <td style="border: 1px solid black; padding: 5px;">${fpass}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 5px;">Date of Travel</td>
                <td style="border: 1px solid black; padding: 5px;">${book_details.departure}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 5px;">Airlines</td>
                <td style="border: 1px solid black; padding: 5px;">${findairline(book_details.service)}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 5px;">Carrier</td>
                <td style="border: 1px solid black; padding: 5px;">${book_details.service}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 5px;">Departure Time</td>
                <td style="border: 1px solid black; padding: 5px;">${depart_time} IST</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 5px;">Arrival Time</td>
                <td style="border: 1px solid black; padding: 5px;">${arrival_time} IST</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 5px;">COWIN Verify Status</td>
                <td style="border: 1px solid black; padding: 5px;">${book_details.cowin}</td>
                </tr>
            </table>
            <br>
            1 represents a valid COWIN Certificate to Passenger at corresponding index
            <br><br>
            Gate closes 45 minutes before Scheduled Departure Time !!!<br><br>`,
            outro: 'Need help, or have any queries? Just reply to this email, we\'d love to help.'
        }
          
    };

    const emailBody = MailGenerator.generate(email);
    const emailText = MailGenerator.generatePlaintext(email);

    let emailOptions = {
        from : `HarNiVik Airline Services <${ENV.SMTP_USERNAME}>`,
        to: tomail,
        subject : `BOOKING CONFIRMED : ${bid}`,
        text: emailText,
        html: emailBody
    }

    // send mail
    transporter.sendMail(emailOptions)
        .then(() => {
            return res.status(201).send({ msg: "You should receive an email from us."})
        })
        .catch(error => res.status(500).send({ error }))
}