const express = require("express")
const userAuthenticate = require("../middlewares/userAuthenticate")
const generateToken = require("../utils/generateToken")
const User = require("../models/users")
const SMTP = require("../models/smtp")
const router = express.Router()
const isAcceptedInputField = require("../utils/isAcceptableInput")
const getJWToken = require("../utils/getJWToken")

router.get("/smtp/lists", userAuthenticate, async (req, res) => {
    try {
        const loggedInUser = req.user
        const data = await SMTP.find({ userId: loggedInUser._id })
        if (data.length === 0) {
            throw new Error("No smtp servers found")
        }
        res.json({ message: "Successfully fetch smtp lists", success: true })
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong",
            err: error.message,
        })
    }
})
router.post("/smtp/create", userAuthenticate, async (req, res) => {
    try {
        const loggedInUser = req.user

        const acceptedFields = ["host", "port", "password", "name", "user"]
        const { host, port, password, name, user } = req.body
        if (!host || !port || !password || !name || !user) {
            throw new Error("Invalid input")
        }
        if (!isAcceptedInputField(acceptedFields, Object.keys(req.body))) {
            throw new Error("Invalid action")
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
            password: await generateToken(password),
            userId: loggedInUser._id,
            name,
        })
        const data = await smtp.save()
        res.json({
            message: "Successfully added smtp server",
            data,
            success: true,
        })
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong",
            err: error.message,
        })
    }
})
router.patch("/smtp/update/:id", userAuthenticate, async (req, res) => {
    const acceptedFields = ["host", "port", "user", "password", "name"]
    try {
        const { host, port, user, password, name } = req.body
        const id = req.params.id
        if (!host || !port || !user || !password || !name) {
            throw new Error("Invalid input")
        }

        if (!isAcceptedInputField(acceptedFields, Object.keys(req.body))) {
            throw new Error("Invalid action")
        }
        const currentUser = await SMTP.findById(id)

        if (!currentUser) {
            throw new Error("User not authenticate please try again")
        }

        const isUniqueServer = await SMTP.findOne({ name })
        if (isUniqueServer) {
            throw new Error("Please select another name")
        }

        for (const field in req.body) {
            currentUser[field] = req.body[field]
        }
        const data = await currentUser.save()
        res.json({ message: "SMTP server updated successfully", data: data })
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong",
            err: error.message,
        })
    }
})
router.delete("/smtp/delete/:id", userAuthenticate, async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            throw new Error("Invalid id")
        }
        const isUserExits = await SMTP.findById(id)
        if (!isUserExits) {
            throw new Error("Something went wrong please login again later")
        }
        await SMTP.findByIdAndDelete(id)
        res.json({ message: "SMTP server deleted successfully" })
    } catch (error) {
        res.status(400).json({ message: "Invalid action", err: error.message })
    }
})

module.exports = router
