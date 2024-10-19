const mongoose = require("mongoose")

const { Schema } = mongoose

const campingSchema = new Schema({
    name: { type: String, required: true },
    emailLists: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "EmailList",
    },
    sendEmail: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SendEmail",
    },
    campingStatus: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    smtpAddress: { type: mongoose.Schema.Types.ObjectId, ref: "SMTP" },
})

module.exports = mongoose.model("Camping", campingSchema)
