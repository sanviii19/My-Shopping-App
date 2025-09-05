const data = require("./data.json");

// console.log("data: ", data);

const createProduct = async (data) => {
    try{
        const resp = await fetch("http://localhost:3900/api/v1/products", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        const result = await resp.json();
        if(resp.status !== 201){
            console.log("----- Product not Created -----", result.message);
        }
    }
    catch(err){
        console.log("Error in creating product: ", err);
    }
};

const createProductMigration = async () => {
    const { products } = data;
    for(let i = 0; i < products.length; i++){
        const productData = products[i];
        productData.price = Math.round(productData.price * 85);
        await createProduct(productData);
        console.log("product created...", i + 1);
    }
};

createProductMigration();