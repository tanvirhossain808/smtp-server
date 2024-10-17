const bcrypt = require("bcrypt")

const generateHashedPassword = async (password, salt = 10) => {
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

module.exports = generateHashedPassword
