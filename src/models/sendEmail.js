const mongoose = require("mongoose")
const validator = require("validator")

const { Schema } = mongoose

const emailTemplateSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    from: {
        type: String,
        required: true,
        max: 200,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address")
            }
        },
    },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    campingId: { type: mongoose.Schema.Types.ObjectId },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    emailSent: { type: Boolean, default: false },
})

module.exports = mongoose.model("EmailTemplate", emailTemplateSchema)
