const nodemailer = require("nodemailer")
const SendEmail = require("../models/sendEmail")
const EmailLists = require("../models/emailLists")
const gt = require("./gt")
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
    const hashedCampingId = await gt(
        { campingId },
        process.env.REPLY_EMAIL_TOKEN_HASH
    )
    const smptServerDetails = await campingEmailDetails(
        SMTP,
        smtpId,
        "SMTP server not found"
    )
    const { password } = await getJWToken(
        smptServerDetails.password,
        process.env.HASHED_PASS
    )
    console.log(password, "smtp password")

    const transporter = nodemailer.createTransport({
        host: smptServerDetails.host,
        port: smptServerDetails.port, // Use secure connection for port 465
        secure: false,
        auth: {
            user: smptServerDetails.user,
            pass: password,
        },
    })

    for (const email of sendEmailListsDetails.emails) {
        let mailOptions = {
            from: "tanvir@ethicalden.com",
            to: email,
            subject: sendEmailDetails.subject,
            text: `${sendEmailDetails.body} delivered to ${hashedCampingId}`,
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
