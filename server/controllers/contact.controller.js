import mailSender from "../utils/mailSender.js";
import Contact from "../models/contact.model.js";

export const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        await mailSender(email, "Contact Form Submission", "Thank you for contacting us. We will get back to you soon.");
        res.status(201).json({ message: "Contact created successfully", contact: newContact });
    } catch (error) {
        console.error("Error creating contact:", error);
    }
}
