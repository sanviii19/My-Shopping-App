const { UserModel } = require("../../../models/userSchema");

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

         if(err.name === "ValidationError" || err.code === 11000){
            res.status(400).json({
                isSuccess: false,
                message: "Email already registered",
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

module.exports = { userSignupController };