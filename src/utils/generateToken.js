const jwt = require("jsonwebtoken")

const generateToken = async (id) => {
    const token = await jwt.sign({ password: id }, process.env.HASHED_PASS)
    return token
}

module.exports = generateToken
