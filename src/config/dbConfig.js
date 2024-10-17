const mongoose = require("mongoose")
const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_DB_USER_NAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.dn10o.mongodb.net/emailBackend`
        )
        console.log("MongoDB Connected")
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`)
        process.exit(1)
    }
}
module.exports = connectDB
