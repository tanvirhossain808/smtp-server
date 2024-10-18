const express = require("express")
const userAuthenticate = require("../middlewares/userAuthenticate")
const isAcceptableInput = require("../utils/isAcceptableInput")
const EmailLists = require("../models/emailLists")
const validator = require("validator")
const router = express.Router()

router.get("/emaillists", userAuthenticate, async (req, res) => {
    try {
        const loggedInUser = req.user
        const data = await EmailLists.find({ createdBy: loggedInUser._id })
        if (data.length === 0) {
            throw new Error("No email lists found")
        }
        res.json({ message: "Successfully fetched email lists", data })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})

router.post("/emaillists/create", userAuthenticate, async (req, res) => {
    try {
        const allowedInputFields = ["name", "emails"]
        const loggedInUser = req.user
        const inputFields = req.body
        if (!inputFields.name || !inputFields.emails) {
            throw new Error("Invalid input")
        }
        if (typeof inputFields.name !== "string") {
            throw new Error("Name must be a string")
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
router.patch("/emaillists/update/:_id", userAuthenticate, async (req, res) => {
    try {
        const allowedInputFields = ["name", "emails"]
        const inputFields = req.body
        const _id = req.params._id
        if (!_id) {
            throw new Error("Invalid id")
        }
        if (!inputFields.name || !inputFields.emails) {
            throw new Error("Invalid input")
        }
        if (typeof inputFields.name !== "string") {
            throw new Error("Name must be a string")
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
        if (!isAcceptableInput(allowedInputFields, Object.keys(inputFields))) {
            throw new Error("Invalid action")
        }
        const updatableEmailDoc = await EmailLists.findById(_id)
        if (!updatableEmailDoc) {
            throw new Error("Invalid action")
        }
        for (const field in inputFields) {
            updatableEmailDoc[field] = inputFields[field]
        }
        const data = await updatableEmailDoc.save()

        res.json({ message: "Successfully updated doc", data })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})

router.delete("/emaillists/delete/:_id", userAuthenticate, async (req, res) => {
    try {
        const _id = req.params._id
        if (!_id || typeof _id !== "string") {
            throw new Error("Invalid id")
        }
        const deletedEmailDoc = await EmailLists.findByIdAndDelete(_id)
        if (!deletedEmailDoc) {
            throw new Error("Email list not found")
        }
        res.json({ message: "Successfully deleted doc", data: deletedEmailDoc })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})

module.exports = router
