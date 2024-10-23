const cron = require("node-cron")
const EmailList = require("../models/emailLists")
const Camping = require("../models/camping")
const SendEmailInfo = require("../models/sendEmail")
const sendEmail = require("../utils/sendEmail")
const SMTP = require("../models/smtp")
const sendingPendingEmails = async () => {
    const job = cron.schedule("* * * * *", async () => {
        try {
            console.log("object")
            const runningCamping = await Camping.find({
                emailSent: false,
            }).populate([
                { path: "emailBody", select: "subject body" },
                { path: "emailLists", select: "emails" },
                { path: "smtpId", select: "host port user password" },
            ])
            if (runningCamping.length === 0)
                return console.log("No running camping found")

            if (runningCamping.length === 0) {
                return console.log("No running camping found")
            }
            for (const camping of runningCamping) {
                const success = await sendEmail(camping)
                if (success) {
                    camping.emailSent = true
                    await camping.save()
                    const emailLists = await EmailList.findByIdAndUpdate(
                        camping.emailLists._id,
                        {
                            $set: {
                                sent: true,
                            },
                        }
                    )
                }
            }
            console.log(runningCamping)
            const { smtpId } = runningCamping
            console.log("Sending pending emails...")
        } catch (error) {
            console.error(error)
            throw new Error("Error in sending emails")
        }
    })
    job.start()
}

module.exports = sendingPendingEmails
