const { OtpModel } = require("../../../models/otpSchema");
const { customAlphabet } = require("nanoid");
const { sendOtpEmail } = require("../../../utils/emailHelper");

const nanoid = customAlphabet("123456789", 4);

const sendOtpController = async (req, res) => {
    try{
        console.log("-----inside sendOtpController -----");

        const { email } = req.body;

        const otp = nanoid();

        // send the otp to the email
        await sendOtpEmail(email, otp);

        // store the otp in the database
        OtpModel.create({ email, otp });

        // send reponse
        res.status(201).json({
            isSuccess: true,
            message: "OTP Sent!",
        })

    }catch(err){
        console.log("----- Error in sendOtpController -----");
        console.log(err.message);

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

module.exports = { sendOtpController };