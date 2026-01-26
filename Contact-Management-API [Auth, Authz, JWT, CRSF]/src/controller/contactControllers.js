import asyncHandler from "../middleware/asyncHandler.js"
import sendResponse from "../utils/sendResponse.js"
import Contact from "../model/contactModel.js"

export const getAllContacts = asyncHandler(async function (req, res) {
    const contacts = await Contact.find({ user_id: req.user.userId })
    sendResponse(res, 200, { data: contacts })
})

export const getTheContact = asyncHandler(async function (req, res) {
    const contact = await Contact.findOne({ _id: req.params.id, user_id: req.user.userId })
    if (!contact) {
        res.status(404)
        throw new Error("contact not found")
    }
    sendResponse(res, 200, { data: contact })
})

export const createContact = asyncHandler(async function (req, res) {
    const { name, email, phone, message } = req.body
    if (!name || !email || !phone) {
        res.status(400)
        throw new Error("Required contact information is missing.")
    }
    const contact = await Contact.create({ user_id: req.user.userId, name, email, phone, message })
    sendResponse(res, 201, { message: "contact created successfully", data: contact })
})

export const updateContact = asyncHandler(async function (req, res) {
    const updatedContact = await Contact.findOneAndUpdate(
        { _id: req.params.id, user_id: req.user.userId },
        req.body,
        { new: true, runValidators: true }
    )

    if (!updatedContact) {
        res.status(404)
        throw new Error("Contact not found")
    }

    sendResponse(res, 200, { message: "Contact updated successfully", data: updatedContact })
})

export const deleteContact = asyncHandler(async function (req, res) {
    const deletedContact = await Contact.findOneAndDelete(
        { _id: req.params.id, user_id: req.user.userId }
    )

    if (!deletedContact) {
        res.status(404)
        throw new Error("Contact not found")
    }

    sendResponse(res, 200, { message: "Contact deleted successfully" })
})