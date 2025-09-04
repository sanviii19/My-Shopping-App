const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ProductSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 1,
        },
        description: {
            type: String,
        },
        quantity: {
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
ProductSchema.pre("findOneAndUpdate", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
ProductSchema.pre("updateOne", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
ProductSchema.pre("updateMany", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
// ------------ Default Validators ------------

const ProductModel = model("product", ProductSchema);

module.exports = { ProductModel }; 