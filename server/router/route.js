import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js';
import { registerMail, successMail } from '../controllers/mailer.js'
import Auth, { localVariables } from '../middleware/auth.js';


/** POST Methods */
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser,controller.login); // login in app
router.route('/data').post(controller.postdata); // booking data from booking portal
router.route('/paymentportal').post(controller.payment); // to proceed to payment portal
router.route('/successMail').post(successMail);

/** GET Methods */
router.route('/user/:username').get(controller.getUser) // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables
router.route('/data').get(controller.getdata); // booking data to booking.js
router.route('/verifyCOWIN').get(controller.verifycertificates) // verify and send feedback back to Verify.js

/** PUT Methods */
router.route('/updateuser').put(Auth, controller.updateUser); // is use to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password
router.route('/updateDetails').put(controller.updateDetails); // is used to update Passenger Details into Booking Schema
router.route('/updatestatus').put(controller.updatestatus); // is used to update booking status of a booking id
router.route('/updateffms').put(controller.updateffms); // is used to add ffms

export default router;