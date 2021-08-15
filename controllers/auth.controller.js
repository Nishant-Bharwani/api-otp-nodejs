const User = require('../models/user.models');
const bcrypt = require('bcryptjs');

const {
    PHONE_NOT_FOUND_ERR,
    PHONE_ALREADY_EXISTS_ERR,
    USER_NOT_FOUND_ERR,
    INCORRECT_OTP_ERR,
    ACCESS_DENIED_ERR,
    WRONG_CREDENTIALS_ERROR
} = require("../errors");

const { checkPassword, hashPassword } = require("../utils/password.util");
const { createJwtToken } = require("../utils/token.util");

const { generateOTP, verifyOTP } = require("../utils/otp.util");

const sendEmail = require('../utils/mail.util');


// ================================ Creating new User ============================================

exports.createNewUser = async(req, res, next) => {
    try {
        let { name, email, phone, password } = req.body;

        const phoneAlreadyExists = await User.findOne({ phone });
        if (phoneAlreadyExists) {
            next({ status: 400, message: PHONE_ALREADY_EXISTS_ERR });
            return;
        }

        const createUser = new User({
            name,
            email,
            phone,
            password: (await bcrypt.hash(password, 10)).toString(),
            role: phone === process.env.ADMIN_PHONE ? "ADMIN" : "USER"
        });

        const user = await createUser.save();

        res.status(200).json({
            type: "success",
            message: "Account created OTP sended to your email ID",
            data: {
                userId: user._id,
            },
        })

        // Generating OTP
        const { otp, fullHash } = generateOTP(email);
        user.phoneOTP = fullHash;
        await user.save();
        const otpMessage = `Hi ${name},\nYour OTP is ${otp}\nIt will expire in 5 minutes`;
        sendEmail(email, otpMessage);


        next();


    } catch (err) {
        next(err);
    }
};


// ====================================== Login with Phone OTP =======================================

exports.loginWithPhoneOtp = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            next({ status: 400, message: PHONE_NOT_FOUND_ERR });
            return;
        }

        const isPassowrdCorrect = await bcrypt.compare(password, user.password);
        if (!isPassowrdCorrect) {
            next({ status: 400, message: PHONE_NOT_FOUND_ERR });
            return;
        }

        res.status(201).json({
            type: "success",
            message: "OTP sended to your registered email ID",
            data: {
                userId: user._id,
            },
        });

        const { otp, fullHash } = generateOTP(email);
        user.phoneOTP = fullHash;
        user.isAccountVerified = true;
        await user.save();
        const otpMessage = `Hi ${name},\nYour OTP is ${otp}\nIt will expire in 5 minutes`;
        sendEmail(email, otpMessage);
        next();
    } catch (err) {
        next(err);
    }
};


// ====================================== Verify Phone OTP =======================================

exports.verifyPhoneOtp = async(req, res, next) => {
    try {
        const { otp, userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            next({ status: 400, message: USER_NOT_FOUND_ERR });
            return;
        }

        const isOTPCorrect = verifyOTP(user.email, user.phoneOTP, otp);
        if (!isOTPCorrect) {
            next({ status: 400, message: INCORRECT_OTP_ERR });
            return;
        }
        const token = createJwtToken({ userId: user._id });
        console.log(token);
        user.phoneOTP = "";
        await user.save();

        res.status(201).json({
            type: "success",
            message: "OTP verified successfully",
            data: {
                token,
                userId: user._id,
            },
        });
    } catch (error) {
        next(error);
    }
};


// ====================================== Fetch Current User =======================================

exports.fetchCurrentUser = async(req, res, next) => {
    try {
        const currentUser = res.locals.user;


        return res.status(200).json({
            type: "success",
            message: "fetch current user",
            data: {
                user: currentUser,
            },
        });
    } catch (error) {
        next(error);
    }
};


// ====================================== Admin Only Access =======================================
exports.handleAdmin = async(req, res, next) => {
    try {
        const currentUser = res.locals.user;

        return res.status(200).json({
            type: "success",
            message: "Okay you are admin!!",
            data: {
                user: currentUser,
            },
        });
    } catch (error) {
        next(error);
    }
};