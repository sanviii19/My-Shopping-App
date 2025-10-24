const sendUserInfoController = async (req, res) => {
    try{
        console.log("-----inside sendUserInfoController -----");

        const user = req.currentUser;
        res.status(200).json({
            isSuccess: true,
            message: "User Info Fetched",
            data: { 
                user: {
                    email: user.email,
                    _id: user._id,
                    role: user.role,
                }
            },
        });

    }catch(err){
        console.log("----- Error in sendUserInfoController -----");
        console.log(err.message);

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

module.exports = { sendUserInfoController };