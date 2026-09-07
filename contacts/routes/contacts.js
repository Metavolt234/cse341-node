const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const contactsCollection = req.app.locals.db.collection("contacts");

    const contacts = await contactsCollection.find().toArray();

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve contacts",
      details: error.message
    });
  }
});

// GET one contact by ID
router.get("/:id", async (req, res) => {
  try {
    const contactsCollection = req.app.locals.db.collection("contacts");

    const contactId = new ObjectId(req.params.id);

    const contact = await contactsCollection.findOne({
      _id: contactId
    });

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found"
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve contact",
      details: error.message
    });
  }
});

module.exports = router;