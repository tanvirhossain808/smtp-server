const mongoose = require("mongoose")
const validator = require("validator")

const { Schema } = mongoose

const emailTemplateSchema = new Schema({
    // sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    // from: {
    //     type: String,
    //     required: true,
    //     max: 200,
    //     validator(value) {
    //         if (!validator.isEmail(value)) {
    //             throw new Error("Invalid email address")
    //         }
    //     },
    // },
    // campingId: { type: mongoose.Schema.Types.ObjectId, ref: "Camping" },
    name: { type: String, required: true, max: 200 },
    subject: { type: String, required: true },
    camping: { type: Boolean, default: false },
    body: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    emailSent: { type: Boolean, default: false },
})

module.exports = mongoose.model("EmailTemplate", emailTemplateSchema)
