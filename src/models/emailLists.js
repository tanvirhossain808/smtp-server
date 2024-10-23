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
        ref: "User",
    },
    // campingId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    // },
    sent: {
        type: Boolean,
        default: false,
    },
    camping: { type: Boolean, default: false },
    sendEmail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmailTemplate",
        default: null,
    },
    replies: [
        {
            from: {
                type: String,
                validate(email) {
                    if (!validator.isEmail(email)) {
                        throw new Error("Invalid email")
                    }
                },
            },
            to: {
                type: String,
                validate(email) {
                    if (!validator.isEmail(email)) {
                        throw new Error("Invalid email")
                    }
                },
            },
            subject: {
                type: String,
                trim: true,
                max: 200,
            },
            message: {
                type: String,
                required: true,
                trim: true,
            },
        },
    ],
})

module.exports = mongoose.model("EmailList", emailListSchema)
