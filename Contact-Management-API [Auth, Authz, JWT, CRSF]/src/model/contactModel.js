import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", index: true,},
    name: { type: String, required: true },
    email : { type: String,  required: true },
    phone: { type: String, required: true },
    message: { type: String, default: "add message" }
}, { timestamps: true })

const Contact = mongoose.model("Contact", contactSchema);

export default Contact