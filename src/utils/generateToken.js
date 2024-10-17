const jwt = require("jsonwebtoken")

const generateToken = (id) => {
    const token = jwt.sign({ password: id }, process.env.HASHED_PASS)
    return token
}

module.exports = generateToken
