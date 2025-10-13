const placeOrderValidator = (req, res, next) => {
     try{
            console.log("-----inside placeOrderValidator -----");
            console.log("Request body:", req.body);
            const { fullName, streetAddress, city, state, primaryContact, alternateContact } = req.body;

            const fields = [
                { name: 'fullName', value: fullName },
                { name: 'streetAddress', value: streetAddress },
                { name: 'city', value: city },
                { name: 'state', value: state },
                { name: 'primaryContact', value: primaryContact },
                { name: 'alternateContact', value: alternateContact }
            ];

            for (const field of fields) {
                if (field.value === "" || field.value === undefined || field.value === null || 
                    (typeof field.value === 'string' && field.value.trim() === '')) {
                    res.status(400).json({
                        isSuccess: false,
                        message: `${field.name} is required and cannot be empty`
                    });
                    return;
                }
            }

            // for(let product in products){
            //     const { productId, quantity } = product;
            //     if(!productId || !quantity || quantity <= 0){
            //         res.status(400).json({
            //             isSuccess: false,
            //             message: "Product ID and valid quantity are required"
            //         })
            //     }
            //     // valid id in object format as specified by mongodb
            //     if(!isValidObjectId(productId)){
            //         res.status(400).json({
            //             isSuccess: false,
            //             message: "Invalid User ID or Product ID"
            //         });
            //         return;
                // }
            // }
    
            next();

        }catch(err){
            console.log("----- Error in placeOrderValidator -----");
            console.log(err.message);
            res.status(500).json({
                isSuccess: false,
                message: "Internal Server Error"
            });
            return;
        }
}

const paymentStatusValidator = (req, res, next) => {
      try {
        console.log("------- inside paymentStatusValidator --------");
        const { orderId } = req.params;

        if (orderId === "" || orderId === undefined || orderId === null) {
            res.status(400).json({
                isSuccess: false,
                message: `Invalid orderId`,
            });
            return;
        }

        next();
    } catch (err) {
        console.log("------- 🔴 Error in paymentStatusValidator --------", err.message);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
}

module.exports = { placeOrderValidator, paymentStatusValidator };