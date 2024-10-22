const express = require("express")
const isUserAuthenticate = require("../middlewares/userAuthenticate")
const ReplyEmails = require("../models/replyEmails")
const validator = require("validator")

const router = express.Router()

router.get(
    "/user/emailreplies/:receiver",
    isUserAuthenticate,
    async (req, res) => {
        try {
            const loggedInUser = req.user
            const { receiver } = req.params
            if (!receiver) {
                throw new Error("Invalid receiver")
            }
            if (!validator.isEmail(receiver)) {
                throw new Error("Invalid receiver")
            }
            const emailReplies = await ReplyEmails.find({
                receiver: receiver,
            })
            res.json({
                message: "Email replies fetched successfully",
                data: emailReplies,
                success: true,
            })
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch email replies" })
        }
    }
)

module.exports = router
