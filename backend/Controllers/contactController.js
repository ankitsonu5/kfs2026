const Contact = require("../models/Contact");

// Create a new contact message
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all contact messages
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a contact message
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
