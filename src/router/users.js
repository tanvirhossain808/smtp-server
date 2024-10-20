const express = require("express")
const User = require("../models/users")
const isUserAutheTicate = require("../middlewares/userAuthenticate")

const router = express.Router()

router.get("/uganda", isUserAutheTicate, async (req, res) => {
    console.log("hey")
    res.send(req.user)
    // res.json(req.user)
    // const user = await User.find({}).select("email")
    // res.json(user)
})
//fixing error

module.exports = router
