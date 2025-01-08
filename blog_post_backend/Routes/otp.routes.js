const express = require('express');
let otpRoute = express.Router();

const {
    enterMail,
    verifyenteredOtp,
    newPassword
} = require('../controller/otp.controller');

otpRoute.post('/enter-mail', enterMail);

otpRoute.post('/verify-otp', verifyenteredOtp);

otpRoute.post('/reset-password', newPassword)

module.exports = otpRoute;
