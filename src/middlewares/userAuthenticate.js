const jwt = require("jsonwebtoken")
const User = require("../models/users")
const isUserAuthenticate = async (req, res, next) => {
    try {
        return res.json({ reqs: req.cookies })
        console.log(req.cookies)
        const { token } = req.cookies
        console.log(token)
        if (!token) {
            throw new Error("Please login again")
        }

        const { _id } = jwt.verify(token, process.env.JWT_TOKEN_HASH)
        const user = await User.findById(_id)
        if (!user) {
            throw new Error("User not authenticate please try again")
        }
        req.user = user
        next()
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
}

module.exports = isUserAuthenticate
