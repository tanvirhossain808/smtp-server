const mongoose = require("mongoose")

const { Schema } = mongoose

const emailTemplateSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    campingId: { type: mongoose.Schema.Types.ObjectId },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
})

module.exports = mongoose.model("EmailTemplate", emailTemplateSchema)
