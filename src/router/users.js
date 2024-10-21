const express = require("express")
const User = require("../models/users")
const isUserAutheTicate = require("../middlewares/userAuthenticate")

const router = express.Router()

router.get("/user/isauthenticated", isUserAutheTicate, async (req, res) => {
    res.json({ message: "success", token: true })
})
//fixing error

module.exports = router
