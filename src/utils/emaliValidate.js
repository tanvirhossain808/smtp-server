const validator = require("validator")
const validate = function (value) {
    if (!validator.isEmail(value)) {
        throw new Error("Invalid email address")
    }
}

module.exports = validate
