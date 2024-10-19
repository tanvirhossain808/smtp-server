const mongoose = require("mongoose")
const validate = require("../utils/emaliValidate")

const { Schema } = mongoose

const replyEmail = new Schema({
    sender: {
        type: String,
        required: true,
        validate,
    },
    receiver: { type: String, required: true, validate },
    subject: { type: String, required: true, max: 200 },
    body: { type: String, required: true, max: 1000 },
    campingId: { type: String, required: true, max: 1000 },
})

module.exports = mongoose.model("ReplyEmail", replyEmail)
