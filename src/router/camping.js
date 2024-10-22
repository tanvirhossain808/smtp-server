const express = require("express")
const Camping = require("../models/camping")
const userAuthenticate = require("../middlewares/userAuthenticate")
const EmailList = require("../models/emailLists")
const SendEmail = require("../models/sendEmail")
const emailSender = require("../utils/emailSender")
const router = express.Router()

router.get("/mails/campings", userAuthenticate, async (req, res) => {
    try {
        const loggedInUser = req.user
        const campings = await Camping.find({
            createdBy: loggedInUser._id,
        }).select("-createdBy")
        if (campings.length === 0) {
            throw new Error("No campings found")
        }
        res.json({
            message: "Successfully fetched campings",
            data: campings,
            success: true,
        })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})
router.post("/mails/set/camping", userAuthenticate, async (req, res) => {
    try {
        const loggedInUser = req.user
        const { emailListId, sendEmailId, name, smtpId } = req.body
        if (!emailListId || !sendEmailId || !name || !smtpId) {
            throw new Error(
                "Invalid operation please try again with right informations"
            )
        }
        const isListEmailAvailable = await EmailList.findById(emailListId)
        if (!isListEmailAvailable) {
            throw new Error("Please select a email list or create a new one")
        }
        const isSendEmailAvailable = await SendEmail.findById(sendEmailId)
        if (!isSendEmailAvailable) {
            throw new Error(
                "Please fill up send email details or select a new one"
            )
        }

        // const campings = await Camping.find({ createBy: loggedInUser._id })
        const newCampings = new Camping({
            name,
            emailLists: emailListId,
            sendEmail: sendEmailId,
            createdBy: loggedInUser._id,
            smtpId,
        })
        const data = await newCampings.save()
        res.json({ message: "Successfully created camping", success: true })
    } catch (error) {
        res.status(400).json({ message: "fails", err: error.message })
    }
})

router.post(
    "/mails/offcamping/false/:campingId",
    userAuthenticate,
    async (req, res) => {
        try {
            const loggedInUser = req.user
            const { campingId } = req.params
            if (!campingId) {
                throw new Error("Invalid params")
            }
            const acceptedStatus = ["true", "false"]
            if (!acceptedStatus.includes(status)) {
                throw new Error("Invalid status")
            }
            const isCampingAvailable = await Camping.findOne({
                campingStatus: true,
                createdBy: loggedInUser._id,
                _id: campingId,
            })
            if (!isCampingAvailable) {
                throw new Error("No camping found")
            }
            if (!isCampingAvailable.campingStatus === false) {
                throw new Error(`Camping status is already ${"off"}`)
            }
            isCampingAvailable.campingStatus = false
            const data = await isCampingAvailable.save()
            res.json({ message: "Camping turned off", success: true })
        } catch (error) {
            res.status(400).json({ message: "fails", err: error.message })
        }
    }
)

router.post(
    "/mails/startcamping/:status/:campingId",
    userAuthenticate,
    async (req, res) => {
        try {
            const loggedInUser = req.user
            // const { smtpId, smtpPassword } = req.body
            // if (!smtpPassword) {
            //     smtpPassword = 2323
            // }
            const { status, campingId } = req.params
            if (!status || !campingId) {
                throw new Error(
                    "Invalid operation please try again with proper information"
                )
            }
            const acceptedStatus = ["true"]
            if (!acceptedStatus.includes(status)) {
                throw new Error("Invalid status")
            }
            const isCampingAlreadyRunning = await Camping.findOne({
                campingStatus: true,
                createdBy: loggedInUser._id,
                _id: campingId,
            })
            if (isCampingAlreadyRunning) {
                throw new Error("Camping is already running")
            }
            const isCampingAvailable = await Camping.findOne({
                campingStatus: false,
                createdBy: loggedInUser._id,
                _id: campingId,
            })
            const { smtpId } = isCampingAvailable
            if (!isCampingAvailable) {
                throw new Error("No camping found")
            }
            if (!isCampingAvailable.campingStatus === status) {
                throw new Error(`Camping status is already ${status}`)
            }
            isCampingAvailable.campingStatus = status === "true" ? true : false
            // isCampingAvailable.smtpAddress = smtpId
            if (isCampingAvailable.campingStatus === true) {
                await emailSender(
                    isCampingAvailable.sendEmail,
                    isCampingAvailable.emailLists,
                    campingId,
                    smtpId
                )
            }
            const data = await isCampingAvailable.save()
            res.json({
                message: "Camping turned on and email sent",
                success: true,
            })
        } catch (error) {
            res.status(400).json({ message: "fails", err: error.message })
        }
    }
)

router.patch(
    "/mails/update/camping/:campingId",
    userAuthenticate,
    async (req, res) => {
        try {
            const loggedInUser = req.user
            const campingId = req.params
            const { emailListId, sendEmailId, name } = req.body
            if (!emailListId || !sendEmailId || !name) {
                throw new Error("Invalid params")
            }
            const camping = await Camping.findOne({
                $or: [{ campingStatus: false }, { campingStatus: true }],
                createdBy: loggedInUser._id,
                _id: campingId,
            })
            if (!camping) {
                throw new Error("No camping found")
            }
            camping.campingStatus = false
            for (const field in camping) {
                if (field in req.body) {
                    camping[field] = req.body[field]
                }
            }
            const updatedCamping = await camping.save()
            res.json({
                message: "Successfully updated camping",
                // data: updatedCamping,
                success: true,
            })
        } catch (error) {
            res.status(400).json({ message: "fails", err: error.message })
        }
    }
)
router.delete(
    "/mails/delete/camping/:campingId",
    userAuthenticate,
    async (req, res) => {
        try {
            const { campingId } = req.params
            if (!campingId) {
                throw new Error("Please provide a valid camping id")
            }
            const deleteCamping = await Camping.findByIdAndDelete(campingId)
            if (!deleteCamping) throw new Error("Camping does not exist")
            res.json({ message: "Camping deleted successfully", success: true })
        } catch (error) {
            res.status(400).json({ message: "fails", err: error.message })
        }
    }
)

module.exports = router
