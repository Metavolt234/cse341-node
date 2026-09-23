const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const requiredFields = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'favoriteColor',
  'birthday',
  'city'
];

function validateContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object.';
  }

  const missing = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || String(body[field]).trim() === ''
  );

  if (missing.length) {
    return `All fields are required. Missing: ${missing.join(', ')}`;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(String(body.email).trim())) {
    return 'Please provide a valid email address.';
  }

  const phonePattern = /^\+?[0-9 ()-]{7,20}$/;
  if (!phonePattern.test(String(body.phone).trim())) {
    return 'Please provide a valid phone number.';
  }

  const date = new Date(`${String(body.birthday).trim()}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(String(body.birthday).trim())) {
    return 'Birthday must use YYYY-MM-DD format.';
  }

  if (String(body.firstName).trim().length < 2 || String(body.lastName).trim().length < 2) {
    return 'First name and last name must each contain at least 2 characters.';
  }

  return null;
}

function contactFromBody(body) {
  return {
    firstName: String(body.firstName).trim(),
    lastName: String(body.lastName).trim(),
    email: String(body.email).trim().toLowerCase(),
    phone: String(body.phone).trim(),
    favoriteColor: String(body.favoriteColor).trim(),
    birthday: String(body.birthday).trim(),
    city: String(body.city).trim()
  };
}

async function getAll(req, res) {
  try {
    const contacts = await getDb().collection('contacts').find().sort({ lastName: 1, firstName: 1 }).toArray();
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

    const contact = contactFromBody(req.body);
    const result = await getDb().collection('contacts').insertOne(contact);

    return res.status(201).json({
      message: 'Contact created successfully.',
      id: result.insertedId,
      contact
    });
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

    return res.status(200).json({ message: 'Contact updated successfully.' });
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

    return res.status(200).json({ message: 'Contact deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete contact.', error: error.message });
  }
}

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };
