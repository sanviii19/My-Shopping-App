const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema, model } = mongoose;

const UserSchema = new Schema(
    {
       email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
       },
       password: {
        type: String,
        required: true,
        trim: true,
       },
       name: {
        type: String,
        trim: true,
       },
       dob: {
        type: String,
       },
       avatar: {
        type: String,
       },
       address: [{
        city: String,
        state: String,
        country: String,
        pincode: String,
        locality: String
       }],
       isProfileCompleted: {
        type: Boolean,
        default: false,
       },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ------------ Default Validators ------------
UserSchema.pre("findOneAndUpdate", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
UserSchema.pre("updateOne", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
UserSchema.pre("updateMany", function(){
    this.options.runValidators = true;
    this.options.new = true;
})
// ------------ Default Validators ------------

UserSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password.toString(), 12);
    }
    next();
})

const UserModel = model("user", UserSchema);

module.exports = { UserModel };