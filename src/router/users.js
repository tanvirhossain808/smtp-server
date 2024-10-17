const express = require("express")
const User = require("../models/users")

const router = express.Router()

router.get("/", async (req, res) => {
    const user = await User.find({}).select("email")
    res.json(user)
})

module.exports = router
