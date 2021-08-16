const nodemailer = require('nodemailer');

module.exports = async function(email_id, msg) {
    try {
        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.EMAIL,
            to: email_id,
            subject: 'Your OTP',
            text: msg
        }

        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }
        });
    } catch (err) {
        console.log(err);
    }
}