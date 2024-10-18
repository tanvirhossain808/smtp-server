const mongoose = require("mongoose")

const { Schema } = mongoose

const replyEmail = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    campingId: { type: String, required: true },
})

module.exports = mongoose.model("ReplyEmail", replyEmail)
