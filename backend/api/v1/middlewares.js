const jwt = require("jsonwebtoken");
const { ROLE_OPTIONS } = require("../../models/userSchema");

const validateUserMiddleware = (req, res, next) => {
    try{
        console.log("-----inside validateUserMiddleware -----");

        const { authentication } = req.cookies;

        if(!authentication){
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized Access - No token provided",
            });
            return;
        }

        jwt.verify(authentication, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                console.log("invalid token");

                res.status(401).json({
                    isSuccess: false,
                    message: "Unauthorized Access",
                });
                return;
            }else{
                console.log("valid token:", decoded);
                req.currentUser = decoded;
                // for debugging purpose only
                // const [p1, p2, p3] = authorization.split(".");
                // console.log("headers:", atob(p1));
                // console.log("payload:", atob(p2));
                // console.log("signature:", p3);
                next();
            }
        })

    }catch(err){
        console.log("----- Error in validateUserMiddleware -----");
        console.log(err.message);

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

const validateIsAdminMiddleware = (req, res, next) => {
    try{
        const {role} = req.currentUser;
    
        if(role === ROLE_OPTIONS.ADMIN){
            req.currentAdmin = req.currentUser;
            next();
        }else{
            res.status(403).json({
                isSuccess: false,
                message: "user is not an admin",
            })
        }

    }catch(err){
        console.log("----- Error in validateIsAdminMiddleware -----");
        console.log(err.message);

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        })
    }
}

module.exports = { validateUserMiddleware, validateIsAdminMiddleware };