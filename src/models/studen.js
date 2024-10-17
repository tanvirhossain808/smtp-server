const mongoose = require("mongoose")
const validator = require("validator")
const { Schema } = mongoose

const studentSchema = new Schema({
    name: { type: String, required: true, max: 200 },
    email: {
        type: String,
        required: true,
        max: 200,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter a valid email")
            }
        },
    },
})

module.exports = mongoose.model("Student", studentSchema)
