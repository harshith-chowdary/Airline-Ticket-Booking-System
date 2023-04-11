import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/** import all components */
import Login from './components/Login';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import Home from './components/Home';
import Booking from './components/Booking';
import Details from './components/Details';
import PageNotFound from './components/PageNotFound';
import Verify from './components/Verify';
import Payment from './components/Payment';
import Success from './components/Success';
import Cancel from './components/Cancel';
import Failed from './components/Failed';
import Booked from './components/Booked';
import Contact from './components/Contact';

/** auth middleware */
import { AuthorizeUser, ProtectRoute, ProtectBooking } from './middleware/auth'

/** root routes */
// const router = createBrowserRouter([
//     {
//         path : '/',
//         element : <Home></Home>
//     },
//     {
//         path : '/login',
//         element : <Login></Login>
//     },
//     {
//         path : '/register',
//         element : <Register></Register>
//     },
//     {
//         path : '/password',
//         element : <ProtectRoute><Password /></ProtectRoute>
//     },
//     {
//         path : '/profile',
//         element : <AuthorizeUser><Profile /></AuthorizeUser>
//     },
//     {
//         path : '/recovery',
//         element : <Recovery></Recovery>
//     },
//     {
//         path : '/reset',
//         element : <Reset></Reset>
//     },
//     {
//         path : '/booking',
//         element : <Booking></Booking>
//     },
//     {
//         path : '*',
//         element : <PageNotFound></PageNotFound>
//     },
// ])

// export default function App() {

//     return (
//         <main>
//             <RouterProvider router = {router}></RouterProvider>
//         </main>
//     )
// };

import {Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App(){
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/password" element={<ProtectRoute><Password /></ProtectRoute>} />
                <Route path="/profile" element={<AuthorizeUser><Profile /></AuthorizeUser>} />
                <Route path="/booking" element={<AuthorizeUser><Booking /></AuthorizeUser>}/>
                <Route path="/details" element={<AuthorizeUser><Details /></AuthorizeUser>}/>
                <Route path="/recovery" element={<Recovery />} />
                <Route path="/reset" element={<Reset />} />
                <Route path="/verify" element={<ProtectBooking><Verify /></ProtectBooking>} />
                <Route path="/payment" element={<ProtectBooking><Payment /></ProtectBooking>}/>
                <Route path="/success" element={<ProtectBooking><Success /></ProtectBooking>}/>
                <Route path="/booked" element={<ProtectBooking><Booked /></ProtectBooking>}/>
                <Route path="/cancel" element={<ProtectBooking><Cancel /></ProtectBooking>}/>
                <Route path="/failed" element={<ProtectBooking><Failed /></ProtectBooking>}/>
                <Route path="/contact" element={<Contact />}/>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    )
}