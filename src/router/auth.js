const express = require("express")
// const userAuthenticate = require("../middlewares/userAuthenticate")
const hashedPassword = require("../utils/generateHashPass")

const router = express.Router()
const User = require("../models/users")

router.post("/signup", async (req, res) => {
    try {
        const { password, email } = req.body
        if (!password || !email) {
            res.json("Please fill the input filed ")
        }
        const acceptableFields = ["password", "email"]
        if (
            !acceptableFields.every((field) =>
                Object.keys(req.body).includes(field)
            )
        ) {
            throw new Error("Invalid fields")
        }
        const isUserAvailable = await User.findOne({ email })
        if (isUserAvailable) {
            return res.status(400).json({ message: "Invalid credential" })
        }
        const encryptedPassword = await hashedPassword(password, 10)

        const user = new User({ email, password: encryptedPassword })
        const token = await user.getJWtToken()
        const data = await user.save()
        res.cookie("token", token)
        res.json({ message: "User created successfully", data })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})
router.post("/login", async (req, res) => {
    try {
        const { password, email } = req.body
        if (!password || !email) {
            res.json("Please fill the input filed ")
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credential" })
        }
        const isPasswordValid = await user.validatePassword(password)
        if (!isPasswordValid) {
            throw new Error("invalid credentials")
        }
        const token = await user.getJWtToken()
        res.cookie("token", token)
        console.log(token)
        res.json({ message: "Logging successfully", token })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})

module.exports = router
