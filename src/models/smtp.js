const mongoose = require("mongoose")
const { Schema } = mongoose

const smtpSchema = new Schema({
    name: { type: String, required: true, max: 100 },
    host: {
        type: String,
        required: true,
        trim: true,
        max: 100,
    },
    port: {
        type: Number,
        default: 587,
        max: 100000,
    },
    user: {
        type: String,
        required: true,
        max: 100,
    },
    password: {
        type: String,
        required: true,
        min: 4,
    },
    userId: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
})

module.exports = mongoose.model("SMTP", smtpSchema)
