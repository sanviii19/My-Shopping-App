const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema, model } = mongoose;

const CartSchema = new Schema(
    {
        userId : {
            type: ObjectId,
            ref: "user",
        },
        productId : {
            type: ObjectId,
            ref: "product",
            required: true,
        },
        cartQuantity : {
            type: Number,
            default: 1,
            min: 1,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ------------ Default Validators ------------
CartSchema.pre("findOneAndUpdate", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
CartSchema.pre("updateOne", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
CartSchema.pre("updateMany", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
// ------------ Default Validators ------------

const CartModel = model("Cart", CartSchema);

module.exports = { CartModel }; 