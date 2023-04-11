let activeuser = 'harshith';

export function setActiveUser(username) {
    activeuser = username;
}

export function getActiveUser(){
    return activeuser;
}

let activebooking = '';

export function setActiveBooking(id) {
    activebooking = id;
}

export function getActiveBooking(){
    return activebooking;
}

let activeverify = '';

export function setActiveVerify(data){
    activeverify = data;
}

export function getActiveVerify(){
    return activeverify;
}

let booking_info = '';

export function setBookingInfo(data){
    booking_info = data;
}

export function getBookingInfo(){
    return booking_info;
}

let useffms = '';

export function setuseffms(data){
  useffms = data;
}

export function getuseffms(){
    return useffms;
}

let isftf = '';

export function setisftf(data){
  isftf = data;
}

export function getisftf(){
    return isftf;
}

// for multiple bookings at same time

// let booking_ids = [];

// export function addId(id){
//     booking_ids.push(id);
//     console.log("Added Successfulyy !!!")
//     console.log(booking_ids[booking_ids.length - 1]);
// }

// export function getId(){
//     return booking_ids[booking_ids.length - 1];
// }

// export function popId(){
//     booking_ids.pop();
// }