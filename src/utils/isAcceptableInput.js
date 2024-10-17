const isAcceptedInputField = (requiredInputField, givingInputField) => {
    if (requiredInputField.length !== givingInputField.length) {
        return false
    }
    return givingInputField.every((field) => requiredInputField.includes(field))
}

module.exports = isAcceptedInputField
