const nodemailer = require("nodemailer")
const SendEmail = require("../models/sendEmail")
const EmailLists = require("../models/emailLists")
const SMTP = require("../models/smtp")
const getJWToken = require("./getJWToken")
const campingEmailDetails = require("../utils/getCampingEmailsDetails")
const emailSender = async (sendEmailId, emailListId, campingId, smtpId) => {
    const sendEmailDetails = await campingEmailDetails(
        SendEmail,
        sendEmailId,
        "email details"
    )
    sendEmailDetails.campingId = campingId
    await sendEmailDetails.save()
    const sendEmailListsDetails = await campingEmailDetails(
        EmailLists,
        emailListId,
        "email lists details"
    )
    const smptServerDetails = await campingEmailDetails(
        SMTP,
        smtpId,
        "SMTP server not found"
    )
    const smtpPassword = getJWToken(
        smptServerDetails.password,
        process.env.HASHED_PASS
    )
    console.log(smtpPassword, "smtp password")

    const transporter = nodemailer.createTransport({
        host: smptServerDetails.host,
        port: smptServerDetails.port, // Use secure connection for port 465
        secure: false,
        auth: {
            user: smptServerDetails.user,
            pass: smtpPassword,
        },
    })

    for (const email of sendEmailListsDetails.emails) {
        let mailOptions = {
            from: smptServerDetails.from,
            to: email,
            subject: sendEmailDetails.subject,
            text: sendEmailDetails.body,
            headers: {
                campingId: campingId, // Include your custom ID
            },
        }

        try {
            await transporter.sendMail(mailOptions)
            console.log(`Email sent to ${email}`)
        } catch (error) {
            console.log(`Error sending to ${email}:`, error)
        }
    }
}

module.exports = emailSender
