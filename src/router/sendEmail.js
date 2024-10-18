const express = require("express")
const userAuthenticate = require("../middlewares/userAuthenticate")
const SendEmail = require("../models/sendEmail")
const SMTP = require("../models/smtp")

const router = express.Router()

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
