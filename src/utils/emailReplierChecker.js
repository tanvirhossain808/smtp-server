const Camping = require("../models/camping")
const cron = require("node-cron")
const SMTP = require("../models/smtp")
const getJwtToken = require("./getJWToken")
const imaps = require("imap-simple")
const SendEmail = require("../models/sendEmail")
const ReplyEmails = require("../models/replyEmails")
const tokenPattern = require("../constant/tokenPattern")
const emailSender = require("./emailSender")
const simpleParser = require("mailparser").simpleParser
let checked = 0
const emailReplierChecker = async () => {
    const job = cron.schedule("* * * * *", async () => {
        const campings = await Camping.find({ campingStatus: false })
        checked++
        if (campings.length === 0) return

        async function processCampings(campings) {
            for (const camping of campings) {
                console.log("hey")
                const { smtpId, _id, sendEmail, emailLists } = camping
                if (!smtpId) {
                    continue
                }

                const smtpDetails = await SMTP.findById(smtpId)
                if (!smtpDetails) {
                    continue
                }
                if (isCampingAvailable.campingStatus === true) {
                    await emailSender(sendEmail, emailLists, _id, smtpId)
                }

                const { password } = await getJwtToken(
                    smtpDetails.password,
                    process.env.HASHED_PASS
                )
                console.log(password)
                const { user, host } = smtpDetails
                const config = {
                    imap: {
                        user,
                        password,
                        host,
                        port: 993,
                        tls: true,
                        authTimeout: 300000,
                        tlsOptions: {
                            rejectUnauthorized: false, // Ignore self-signed certificate
                        },
                    },
                }

                try {
                    const connection = await imaps.connect(config)
                    await connection.openBox("INBOX")

                    const searchCriteria = ["UNSEEN"] // Look for unread emails
                    const fetchOptions = {
                        bodies: ["HEADER", "TEXT"],
                        markSeen: true,
                    }

                    const messages = await connection.search(
                        searchCriteria,
                        fetchOptions
                    )

                    // Process each message
                    for (const message of messages) {
                        const all = message.parts.find(
                            (part) => part.which === "TEXT"
                        )
                        const headers = message.parts.find(
                            (part) => part.which === "HEADER"
                        ).body
                        const destructuringSubject = headers.subject[0]
                            .replace(/^Re:\s*/, "")
                            .trim() // Remove "Re:" prefix if present
                        const destructuringFrom = headers.from[0].match(
                            /<(.+)>/
                        )
                            ? headers.from[0].match(/<(.+)>/)[1]
                            : headers.from[0]
                        const destructuringTo = headers.to[0]
                        // console.log("headers:", headers)
                        const id = message.attributes.uid
                        const idHeader = "Imap-Id: " + id + "\r\n"
                        console.log(
                            "id:",
                            destructuringSubject,
                            "from",
                            destructuringFrom
                        )

                        const parsed = await new Promise((resolve, reject) => {
                            simpleParser(
                                idHeader + headers + all.body,
                                (err, parsed) => {
                                    if (err) {
                                        console.error(
                                            "Error parsing email:",
                                            err
                                        )
                                        return reject(err)
                                    }
                                    resolve(parsed)
                                }
                            )
                        })
                        console.log(parsed.toString)

                        let body = parsed.text || "No body content"
                        // body = body.match(/^(.*?)\nOn\s+.*$/s)
                        const dynamicBodyMatch = body.match(/^(.*?)\nOn\s+.*$/s)
                        const dynamicBody = dynamicBodyMatch
                            ? dynamicBodyMatch[1].trim()
                            : body.trim()

                        const tokenPattern = /delivered to ([a-zA-Z0-9\.\-_]+)/ // Regular expression pattern for the token
                        const tokenMatch = body.match(tokenPattern) // Find the token using the regex

                        const extractedToken =
                            tokenMatch && tokenMatch[1] ? tokenMatch[1] : null
                        const { campingId } = await getJwtToken(
                            extractedToken,
                            process.env.REPLY_EMAIL_TOKEN_HASH
                        )
                        // const token
                        // console.log("")
                        // console.log(
                        //     "campingId:",
                        //     campingId,
                        //     "body:",
                        //     dynamicBody,
                        //     "from:",
                        //     destructuringFrom,
                        //     "to:",
                        //     destructuringTo,
                        //     "subject:",
                        //     destructuringSubject
                        //     // body
                        // )
                        if (
                            !campingId ||
                            !body ||
                            !destructuringTo ||
                            !destructuringFrom ||
                            !destructuringSubject
                        ) {
                            return console.log("nothing")
                        }
                        const data = new ReplyEmails({
                            sender: destructuringFrom,
                            receiver: destructuringTo,
                            subject: destructuringSubject,
                            campingId,
                            body: dynamicBody,
                        })
                        const savedData = await data.save()
                        console.log(savedData)
                    }
                } catch (error) {
                    console.error("Error processing emails:", error)
                }
            }
        }

        // Call the function with your campings array
        processCampings(campings)
    })
    /*  */
    job.start()
}
module.exports = emailReplierChecker
