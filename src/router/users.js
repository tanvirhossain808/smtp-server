const express = require("express")
const User = require("../models/users")
const isUserAutheTicate = require("../middlewares/userAuthenticate")

const router = express.Router()

router.get("/uganda", isUserAutheTicate, async (req, res) => {
    res.json(req.user)
    // const user = await User.find({}).select("email")
    // res.json(user)
})

module.exports = router
