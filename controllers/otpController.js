const sendEmail = require('./sendEmail');

let recentOTPs = [
    
];

async function generateOTP(email) {

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const response = await sendEmail(otp, email);

    if(!response) {
        console.log("email sending failed");
        return false; 
    }
    recentOTPs.push(
        [email, otp]
    );

    setTimeout(() => {

        recentOTPs = recentOTPs.filter(pair => pair[0] !== email);
    }, 2 * 60 * 1000);

    console.log("otp sent");
    return true;
}

function verifyOTP(email, otp) {

    const result = recentOTPs.find(pair => pair[0] === email);

    if(!result) {
        console.log("otp not found");
        return null;
    }

    if(result[1] === otp) {

        console.log("otp verified");
        return otp;

    } else {

        console.log("invalid otp");
        return null;
    }
}

module.exports = {generateOTP, verifyOTP};