const { OtpModel } = require("../../../models/otpSchema");
const bcrypt = require("bcrypt");

const validateOtpMiddleware = async (req, res, next) => {
    try{
        console.log("-----inside validateOtpMiddleware -----");

        const { email, otp } = req.body;
        const otpDoc = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

        if(!otpDoc){
            res.status(400).json({
                isSuccess: false,
                message: "OTP not found. Please request a new OTP"
            });
            return;
        }
        const { otp: hashedOtp } = otpDoc;

        const isValidOtp = await bcrypt.compare(otp.toString(), hashedOtp);

        if(!isValidOtp){
             res.status(400).json({
                isSuccess: false,
                message: "OTP is invalid"
            });
            return;
        }
        next();
    }catch(err){
        console.log("----- Error in validateOtpMiddleware -----");
        console.log(err.message);

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}


module.exports = { validateOtpMiddleware };