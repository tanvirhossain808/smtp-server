const mongoose = require("mongoose")

const { Schema } = mongoose

const campingSchema = new Schema({
    name: { type: String, required: true },
    emailLists: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "EmailList",
    },
    // sendEmail: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: "SendEmail",
    // },
    emailBody: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "EmailTemplate",
        default: null,
    },
    emailSent: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    smtpId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SMTP",
    },
    smtpAddress: { type: mongoose.Schema.Types.ObjectId, ref: "SMTP" },
})

module.exports = mongoose.model("Camping", campingSchema)
