const express = require("express")
const userAuthenticate = require("../middlewares/userAuthenticate")
const generateToken = require("../utils/generateToken")
const User = require("../models/users")
const SMTP = require("../models/smtp")
const router = express.Router()

router.post("/create/smtp", userAuthenticate, async (req, res) => {
    try {
        const loggedInUser = req.user

        const { host, port, user, password, name } = req.body
        if (!host || !port || !user || !password || !name) {
            throw new Error("Invalid input")
        }

        const isUserAvailable = await User.findById(loggedInUser._id)
        if (!isUserAvailable) {
            throw new Error("User not authenticate please try again")
        }
        const isUniqueServer = await SMTP.findOne({ name })
        if (isUniqueServer) {
            throw new Error("Server name already exists")
        }
        const smtp = new SMTP({
            host,
            port,
            user,
            password: "generateToken(password)",
            userId: loggedInUser._id,
            name,
        })
        const data = await smtp.save()
        res.json({ message: "Successfully added smtp server", data: data })
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong",
            err: error.message,
        })
    }
})

module.exports = router
