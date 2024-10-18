const express = require("express")
const Camping = require("../models/camping")
const userAuthenticate = require("../middlewares/userAuthenticate")
const router = express.Router()

router.get("/mails/campings", userAuthenticate, async (req, res) => {
    try {
        const loggedInUser = req.user
        const campings = await Camping.find({ createBy: loggedInUser._id })
        if (campings.length === 0) {
            throw new Error("No campings found")
        }
        res.json({ message: "Successfully fetched campings", data: campings })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})

module.exports = router
