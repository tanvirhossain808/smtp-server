const mongoose = require("mongoose")
const validator = require("validator")
const { Schema } = mongoose

const emailListSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        max: 100,
    },
    emails: [
        {
            type: String,
            required: true,
            validate(email) {
                if (!validator.isEmail(email)) {
                    throw new Error("Invalid email")
                }
            },
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        max: 300,
        ref: "User",
    },
})

module.exports = mongoose.model("EmailList", emailListSchema)
