const express = require("express");
const router = express.Router();
const contactController = require("../Controllers/contactController");

// Post a new contact message
router.post("/contact", contactController.createContact);

// Get all contact messages (should probably be protected by admin middleware but maintaining current project structure)
router.get("/contact", contactController.getContacts);

// Delete a contact message
router.delete("/contact/:id", contactController.deleteContact);

module.exports = router;
