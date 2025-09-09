const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema, model } = mongoose;

const OtpSchema = new Schema(
    {
       email: {
        type: String,
        required: true,
        trim: true,
       },
       otp: {
        type: String,
        required: true,
        trim: true,
       }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ------------ Default Validators ------------
OtpSchema.pre("findOneAndUpdate", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
OtpSchema.pre("updateOne", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
OtpSchema.pre("updateMany", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
// ------------ Default Validators ------------

OtpSchema.pre("save", async function (next) {
    if(this.isModified("otp")){
        this.otp = await bcrypt.hash(this.otp.toString(), 12);
    }
    next();
})

const OtpModel = model("otp", OtpSchema);

module.exports = { OtpModel };