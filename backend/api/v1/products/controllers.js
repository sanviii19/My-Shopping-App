const { ProductModel } = require("../../../models/productSchema");

const getProductController = async (req, res) =>{
    console.log("----- Inside getProductController -----");
    try{
        const products = await ProductModel.find();
        res.status(200).json({
            isSucess: true,
            message: "products fetched",
            data: {
                products,
            },
        });
    }
    catch(err){
        console.log("----- Error inside getProductController -----", err.message);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const createProductController = async (req, res) => {
    try{
        const data = req.body;

        const newProduct = await ProductModel.create(data);

        res.status(201).json({
            isSuccess: true,
            message: "Product Created",
            data:{ 
                newProduct
            },
        });
    }
    catch(err){
        console.log("----- Error inside createProductController -----", err.message);

        if(err.name === "ValidationError" || err.code === 11000){
            res.status(400).json({
                isSuccess: false,
                message: err.message,
                data: {},
            });
            return;
        }

         res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
            data: {},
        });
    }
};

const updateProductController = async (req, res) => {
    try{
        const data = req.body;
        const { productId } = req.params; 

        if(!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400).json({
            isSuccess: false,
            message: "Invalid productId format",
            data: {},
            });
            return;
        }

        const updateProduct = await ProductModel.findByIdAndUpdate(productId, data).lean();

        if(updateProduct === null){
            res.status(400).json({
                isSuccess: false,
                message: "productId does not match",
                data: {},
            });
        }

        res.status(200).json({
            isSuccess: true,
            message: "Product Updated",
            data:{ 
                updateProduct,
            },
        });
    }
    catch(err){
        console.log("----- Error inside updateProductController -----", err.message);

        if(err.name === "ValidationError" || err.code === 11000){
            res.status(400).json({
                isSuccess: false,
                message: err.message,
                data: {},
            });
            return;
        }

         res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
            data: {},
        });
    }
}

const deleteProductController = async (req, res) => {
    try{
        const { productId } = req.params; 

        const deleteProduct = await ProductModel.findByIdAndDelete(productId);

        if(deleteProduct === null){
            res.status(400).json({
                isSuccess: false,
                message: "productId does not match",
                data: {},
            });
        }

        res.status(204).json({  // 204 - No Content
            isSuccess: true,
            message: "Product deleted",
            data:{ 
                deleteProduct,
            },
        });
    }
    catch(err){
        console.log("----- Error inside deleteProductController -----", err.message);

         res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
            data: {},
        });
    }
};

const listProductController = async (req, res) => {
   try {
        console.log("--------- inside listProductsControllers ----------");
        const {
            limit,
            page,
            select = "title price quantity images",
            q = "",
            maxPrice,
            sort = "title -price -createdAt",
        } = req.query;

        const searchRegex = new RegExp(q, "ig");

        const selectedItems = select.replaceAll(",", " ");

        let limitNum = Number(limit);
        if (limitNum <= 0 || Number.isNaN(limitNum)) {
            limitNum = 5;
        }
        if (limitNum >= 50) {
            limitNum = 50;
        }
        let pageNum = Number(page) || 1;
        if (pageNum <= 0 || Number.isNaN(pageNum)) {
            pageNum = 1;
        }
        const skipNum = (pageNum - 1) * limitNum;

        const query = ProductModel.find(); // waiter will come and start taking order
        query.select(selectedItems); // giving waiter some order items
        query.or([{ title: searchRegex }, { description: searchRegex }]); // giving waiter some order items

        const maxPriceNum = Number(maxPrice);
        if (maxPrice && !Number.isNaN(maxPriceNum)) {
            query.where("price").lte(maxPrice); // giving waiter some order items
        }

        const totalDocumentsCount = await query.clone().countDocuments(); // the clone query will have all the instructions that have been given till now

        // limit the number of items (PAGINATION)
        query.skip(skipNum); // giving waiter some order items
        query.limit(limitNum); // giving waiter some order items
        query.sort(sort);

        const products = await query; // telling waiter that i have given my order now execute it

        res.status(200).json({
            isSuccess: true,
            message: "Product list",
            data: {
                products,
                total: totalDocumentsCount,
                skip: skipNum,
                limit: Math.min(limitNum, products.length),
            },
        });
    } catch (err) {
        console.log("--------- error in listProductsControllers ----------", err.message);

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
            data: {},
        });
    }
};



module.exports = { createProductController,
                   getProductController,
                   updateProductController,
                   deleteProductController,
                   listProductController };