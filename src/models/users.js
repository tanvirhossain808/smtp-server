const mongoose = require("mongoose")
const validate = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const { Schema } = mongoose
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Please add email"],
        unique: true,
        trim: true,
        validate(value) {
            if (!validate.isEmail(value)) {
                throw new Error("Please enter a valid email")
            }
        },
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.methods.getJWtToken = async function () {
    const token = await jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_TOKEN_HASH,
        {
            expiresIn: "7d",
        }
    )
    return token
}

userSchema.methods.validatePassword = async function (passByUser) {
    const isPasswordValid = await bcrypt.compare(passByUser, this.password)
    return isPasswordValid
}

module.exports = mongoose.model("User", userSchema)
