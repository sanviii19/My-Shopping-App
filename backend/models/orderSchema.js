const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema, model } = mongoose;

const OrderSchema = new Schema(
    {
        userId : {
            type: ObjectId,
            ref: "user",
        },
        productIds : [
            {
                product: {
                    type: ObjectId,
                    ref: "product",
                    required: true,
                },
                cartQuantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 1,
                }
            }
        ],
        address: {
            type: String,
            trim: true,
            required: true,
        },
        contactNumbers: [String],
        orderStatus: {
            type: String,
            enum: ["pending", "in progress", "completed", "failed", "cancelled"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["INITIALIZED","ABANDONDED",
                // below enums are from cashfree
                 "SUCCESS", "FAILED", "NOT_ATTEMPTED", "PENDING", "FLAGGED", "CANCELLED", "VOID", "USER_DROPPED"],
            default: "INITIALIZED",
        },
        paymentDetails: Object,
        paymentSessionId: String,
        lastUpdatedpaymentDetails: Object,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ------------ Default Validators ------------
OrderSchema.pre("findOneAndUpdate", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
OrderSchema.pre("updateOne", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
OrderSchema.pre("updateMany", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
// ------------ Default Validators ------------

const OrderModel = model("order", OrderSchema);

module.exports = { OrderModel }; 