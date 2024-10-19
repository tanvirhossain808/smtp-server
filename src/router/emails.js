const express = require("express")
const userAuthenticate = require("../middlewares/userAuthenticate")
const SendEmail = require("../models/sendEmail")
const SMTP = require("../models/smtp")

const router = express.Router()
router.get("/mail/emailbodylist", userAuthenticate, async (req, res) => {
    try {
        const loggedInUsers = req.user
        const emailsSendLists = await SendEmail.find({
            createdBy: loggedInUsers._id,
        })
        if (emailsSendLists.length === 0) {
            throw new Error("No emailsbodies found")
        }
        res.json({
            message: "Successfully fetched email bodies",
            data: emailsSendLists,
        })

        // const data = await emailBody.save()
        // res.json({ message: "Successfully created email body", data })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})
router.post("/mail/creates", userAuthenticate, async (req, res) => {
    try {
        const loggedInUsers = req.user
        const { subject, body, name } = req.body
        if (!subject || !body || !name) {
            throw new Error("Invalid input")
        }
        if (typeof subject !== "string" || typeof body !== "string") {
            throw new Error("Subject and body must be string")
        }
        if (subject.length > 200) {
            throw new Error(
                "Subject length should be less than or equal to 200 characters"
            )
        }
        if (name.length > 200) {
            throw new Error(
                "Name length should be less than or equal to 200 characters"
            )
        }

        const emailBody = new SendEmail({
            subject,
            name,
            body,
            createdBy: loggedInUsers._id,
        })
        const data = await emailBody.save()
        res.json({ message: "Successfully created email body", data })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})

/* 

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


*/
router.get("/mail/sendmail/:campingId", userAuthenticate, async (req, res) => {
    try {
        const loggedInUser = req.user
        const { campingId } = req.params
        if (!campingId) {
            return res.json({ message: "smpt id is missing" })
        }
        const camping = await SMTP.findById(campingId)
        if (!camping) {
            throw new Error("Could not found smtp server")
        }
        const sendEmail = SendEmail.find({
            campingId,
            createdBy: loggedInUser._id,
        })
        if (sendEmail.length === 0) {
            return res.json({ message: "No email to send" })
        }
        res.json({ message: "Sending emails", data: sendEmail })
    } catch (error) {
        res.status(404).json({ message: "fails", err: error.message })
    }
})

module.exports = router
