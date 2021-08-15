// const generateOTP = (length) => {
//     return 123456;
// }

// module.exports = generateOTP;

const crypto = require('crypto');
const otpGenerator = require('otp-generator');
exports.generateOTP = (email) => {
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${email}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", process.env.SECRET_KEY).update(data).digest("hex");
    const fullHash = `${hash}.${expires}`;

    return { otp, fullHash };
}


exports.verifyOTP = (email, hash, otp) => {
    let [hashValue, expires] = hash.split(".");
    let now = Date.now();
    if (now > parseInt(expires)) return false;
    let data = `${email}.${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac("sha256", process.env.SECRET_KEY).update(data).digest("hex");
    if (newCalculatedHash === hashValue) {
        return true;
    } else {
        return false;
    }
}