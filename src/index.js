const express = require("express")
require("dotenv").config()
const parser = require("cookie-parser")
const connectDB = require("./config/dbConfig")
const authRouter = require("./router/auth")
const smtpRouter = require("./router/smtp")

const app = express()

app.use(express.json())
app.use(parser())

app.use("/", authRouter)
app.use("/", smtpRouter)
app.get("/", (req, res) => {
    res.json("success")
})
const PORT = process.env.PORT || 8000

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error(err)
    })
