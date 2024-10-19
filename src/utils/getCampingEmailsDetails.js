const campingEmailDetails = async (Schema, _id, message) => {
    const camping = await Schema.findById(_id)
    if (!camping) {
        throw new Error(`Could not found ${message}`)
    }
    return camping
}

module.exports = campingEmailDetails
