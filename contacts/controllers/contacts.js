const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

function validateContact(body) {
  const missing = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || String(body[field]).trim() === ''
  );

  if (missing.length > 0) {
    return `All fields are required. Missing: ${missing.join(', ')}`;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(String(body.email).trim())) {
    return 'Please provide a valid email address.';
  }

  if (Number.isNaN(Date.parse(body.birthday))) {
    return 'Please provide birthday as a valid date such as 2000-01-31.';
  }

  return null;
}

function contactFromBody(body) {
  return {
    firstName: String(body.firstName).trim(),
    lastName: String(body.lastName).trim(),
    email: String(body.email).trim(),
    favoriteColor: String(body.favoriteColor).trim(),
    birthday: String(body.birthday).trim()
  };
}

async function getAll(req, res) {
  try {
    const contacts = await getDb().collection('contacts').find().toArray();
    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve contacts.', error: error.message });
  }
}

async function getSingle(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact id.' });
    }

    const contact = await getDb().collection('contacts').findOne({ _id: new ObjectId(req.params.id) });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    return res.status(200).json(contact);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve contact.', error: error.message });
  }
}

async function createContact(req, res) {
  try {
    const validationError = validateContact(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await getDb().collection('contacts').insertOne(contactFromBody(req.body));
    return res.status(201).json({ id: result.insertedId });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create contact.', error: error.message });
  }
}

async function updateContact(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact id.' });
    }

    const validationError = validateContact(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await getDb().collection('contacts').replaceOne(
      { _id: new ObjectId(req.params.id) },
      contactFromBody(req.body)
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update contact.', error: error.message });
  }
}

async function deleteContact(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact id.' });
    }

    const result = await getDb().collection('contacts').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete contact.', error: error.message });
  }
}

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };
