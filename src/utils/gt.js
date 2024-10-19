const jwt = require("jsonwebtoken")

const generateToken = async (id, hash) => {
    const token = await jwt.sign(id, hash)
    return token
}

module.exports = generateToken
