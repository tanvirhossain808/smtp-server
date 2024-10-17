const express = require("express")
const userAuthenticate = require("../middlewares/userAuthenticate")
const isAcceptableInput = require("../utils/isAcceptableInput")
const EmailLists = require("../models/emailLists")
const validator = require("validator")
const router = express.Router()

router.post("/emaillists/create", userAuthenticate, async (req, res) => {
    try {
        const allowedInputFields = ["name", "emails"]
        const loggedInUser = req.user
        const inputFields = req.body
        if (!inputFields.name || !inputFields.emails) {
            throw new Error("Invalid input")
        }
        if (!Array.isArray(inputFields.emails)) {
            throw new Error("Invalid input")
        }
        if (
            !inputFields.emails.every(
                (email) => typeof email === "string" && validator.isEmail(email)
            )
        ) {
            throw new Error("Please type correct email address")
        }
        const { _id } = loggedInUser
        if (!isAcceptableInput(allowedInputFields, Object.keys(inputFields))) {
            throw new Error("Invalid action")
        }
        const emailLists = new EmailLists({
            name: inputFields.name,
            emails: inputFields.emails,
            createdBy: _id,
        })
        const data = await emailLists.save()
        res.json({ message: "Successfully created email list", data })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})

module.exports = router
