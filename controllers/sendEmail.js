const nodemailer = require('nodemailer');

let transporter = null;

module.exports = async function sendMail(data, toEmail) {
    
    try {


        if(!transporter) transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        
        
        const mailOptions = {
            from: {
                name: "OxiLive",
                address: process.env.EMAIL_USER
            },
            to: toEmail,
            subject: "[OTP] Verify your account on OxiLive",
            text: "Hello, please verify your email on OxiLive.",
            html: `
            <p>Hello, please verify your email on OxiLive.</p>
            <h1>${data}</h1>
            <p>Your OTP for email verification</p>`
        }
        
        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent: "+ info.response);

        return info.response;

    } catch (err) {
        console.log(err.message);
        return null;
    }
}