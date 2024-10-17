const jwt = require("jsonwebtoken")

const getJWToken = async function (password, string) {
    return jwt.verify(password, string)
}

module.exports = getJWToken
