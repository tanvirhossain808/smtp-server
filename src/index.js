const express = require("express")
require("dotenv").config()
const parser = require("cookie-parser")
const connectDB = require("./config/dbConfig")
const authRouter = require("./router/auth")
const smtpRouter = require("./router/smtp")
const emailLists = require("./router/emailLists")
const campingRoute = require("./router/camping")
const emailRouter = require("./router/emails")
const cors = require("cors")
// const emailReplierChecker = require("./utils/emailReplierChecker")
const emailReplierListRouter = require("./router/replyemail")
const emailReplyChecker = require("./utils/emailReplierChecker")

const entryPointRouter = require("./router/users")
const sendingPendingEmails = require("./cron-task/sendingPendingEmai")

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    "https://email-server-front-end.vercel.app",
]

app.use(
    cors({
        origin: allowedOrigins, // Allow requests from these origins
        credentials: true, // Allow credentials (cookies)
    })
)
app.use(express.json())
app.use(parser())

// app.use("/hey", (req, res) => {
//     res.send("Welcome")
// })
app.use("/", entryPointRouter)
app.use("/", authRouter)
app.use("/", smtpRouter)
app.use("/", emailLists)
app.use("/", campingRoute)
// app.use("/", sendEmailRoute)
app.use("/", emailRouter)
app.use("/", emailReplierListRouter)
app.get("/", (req, res) => {
    res.json("success")
})
const PORT = process.env.PORT || 8000

connectDB()
    .then(() => {
        app.listen(PORT, async () => {
            console.log(`Server is running on port ${PORT}`)
            // await emailReplyChecker()
            await sendingPendingEmails()
        })
    })
    .catch((err) => {
        console.error(err)
    })
