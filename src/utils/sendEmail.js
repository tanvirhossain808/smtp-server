const nodemailer = require("nodemailer")
const getJWToken = require("../utils/getJWToken")
const gt = require("./gt")
const sendEmail = async (camping) => {
    const { emailLists, smtpId, emailBody } = camping
    const { _id: emailListId, emails } = emailLists
    const { _id: emailBodyId, subject, body } = emailBody
    const { _id: smtpUniqueId, host, port, user, password } = smtpId
    const { password: decPassword } = await getJWToken(
        password,
        process.env.HASHED_PASS
    )
    console.log(decPassword, "decPassword", user)

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: false,
        auth: {
            user,
            pass: decPassword,
        },
    })
    const hashedCampingId = await gt(
        { emailListId },
        process.env.REPLY_EMAIL_TOKEN_HASH
    )
    console.log(decPassword, "dexPassword")
    const sendEmails = emails.map((email) => {
        console.log(email)
        const mailOptions = {
            from: user,
            to: email,
            subject,
            text: `${body} delivered to body id : ${hashedCampingId}`,
        }
        return transporter.sendMail(mailOptions)
    })

    const results = await Promise.allSettled(sendEmails)

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            console.log(
                `Email sent to ${emails[index]}: ${result.value.response}`
            )
        } else {
            console.error(
                `Failed to send email to ${emails[index]}: ${result.reason}`
            )
        }
    })

    return true
}

module.exports = sendEmail
