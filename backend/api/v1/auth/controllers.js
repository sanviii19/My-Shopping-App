const { UserModel } = require("../../../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSignupController = async (req, res) => {
    try{
        console.log("-----inside userSignupController -----");
         // we need to create the user
        const { email, password } = req.body;

        const newUser = await UserModel.create({ 
            email,
            password,
        });

        res.status(201).json({
            isSuccess: true,
            message: "User Created!",
            data: {
                user: {
                    mail: newUser.email,
                    _id: newUser._id,
                },
            },
        });
    }catch(err){
        console.log("----- Error in userSignupController -----");
        console.log(err.message);

        if(err.code === 11000){
            res.status(409).json({
                isSuccess: false,
                message: "Email already registered",
                data: {},
            });
            return;
        }
        if(err.name === "ValidationError"){
            res.status(400).json({
                isSuccess: false,
                message: "Invalid email or password",
                data: {},
            });
            return;
        }

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

const userLoginController = async (req, res) => {
    try{
        console.log("-----inside userLoginController -----");

        const { email, password } = req.body;

        // check if the user with the given email exists
        const userDoc = await UserModel.findOne({email}).lean();
        if(!userDoc){
            res.status(401).json({
                isSuccess: false,
                message: "user account does not exist! please Signup",
            })
            return;
        }

        // check if the password matches
        const hashedPassword = userDoc.password;
        
        // console.log("🔍 LOGIN DEBUG:");
        // console.log("Input password:", password);
        // console.log("Stored hash:", hashedPassword);
        // console.log("Hash exists:", !!hashedPassword);
        
        const isCorrect = await bcrypt.compare(password.toString(), hashedPassword);
        // console.log("Comparison result:", isCorrect);
        if(!isCorrect){
            res.status(401).json({
                isSuccess: false,
                message: "Incorrect Password",
            })
            return;
        }

        const token = jwt.sign({
            email: userDoc.email,
            _id: userDoc._id,
            role: userDoc.role,
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: '1d' // token will expire in 1 day
        });
        console.log("Generated JWT:", token);
        
        res.cookie("authentication", token, {
            httpOnly: true,
            sameSite: "None", // because fronted and backend are on different domains
            secure: true, // only over https
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({
            isSuccess: true,
            message: "User Logged In!",
            // data: {
            //     user: {
            //         mail: email,
            //         _id: userDoc._id,
            //     },
            // },
        });
    }catch(err){
        console.log("----- Error in userLoginController -----");
        console.log(err.message);

        if(err.name === "ValidationError"){
            res.status(400).json({
                isSuccess: false,
                message: "Invalid email or password",
                data: {},
            });
            return;
        }

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

const userLogoutController = async (req, res) => {
    try{
        console.log("-----inside userLogoutController -----");

        res.cookie("authentication", "", {
            httpOnly: true,
            sameSite: "None", // because fronted and backend are on different domains
            secure: true, // only over https
            maxAge: 0,
        });

        res.status(200).json({
            isSuccess: true,
            message: "User Logged Out!",
        });

    }catch(err){
        console.log("----- Error in userLogoutController -----");
        console.log(err.message);

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

module.exports = { userSignupController, userLoginController, userLogoutController };