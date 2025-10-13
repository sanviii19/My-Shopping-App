const userSignupValidator = (req, res, next) => {
    try{
        console.log("-----inside userSignupValidator -----");
        const { email, otp, password } = req.body;

        if(!email || !otp || !password){
            res.status(400).json({
            isSuccess: false,
            message: "Email, OTP and Password are required"
        });
        return;
        }

        // valid email using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            res.status(400).json({
                isSuccess: false,
                message: "Invalid Email"
            });
            return;
        }
        // validate password length --> 8 characters
        // if(password.length < 8){
        //     res.status(400).json({
        //         isSuccess: false,
        //         message: "Password must be at least 8 characters long"
        //     });
        //     return;
        // }
        next();
    }catch(err){
        console.log("----- Error in userSignupValidator -----");
        console.log(err.message);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

const userLoginValidator = (req, res, next) => {
    try{
        console.log("-----inside userLoginValidator -----");
        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).json({
            isSuccess: false,
            message: "Email and Password are required"
        });
        return;
        }

        // valid email using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            res.status(400).json({
                isSuccess: false,
                message: "Invalid Email"
            });
            return;
        }

        next();
    }catch(err){
        console.log("----- Error in userLoginValidator -----");
        console.log(err.message);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

module.exports = { userSignupValidator, userLoginValidator };