const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const requiredFields = [
  'name',
  'description',
  'category',
  'organization',
  'location',
  'startDate',
  'status'
];

const allowedStatuses = ['planned', 'active', 'completed'];

function validateProject(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object.';
  }

  const missing = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || String(body[field]).trim() === ''
  );

  if (missing.length) {
    return `All fields are required. Missing: ${missing.join(', ')}`;
  }

  if (String(body.name).trim().length < 3) {
    return 'Project name must contain at least 3 characters.';
  }

  if (String(body.description).trim().length < 10) {
    return 'Project description must contain at least 10 characters.';
  }

  if (!allowedStatuses.includes(String(body.status).trim().toLowerCase())) {
    return `Status must be one of: ${allowedStatuses.join(', ')}.`;
  }

  const date = new Date(`${String(body.startDate).trim()}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(String(body.startDate).trim())) {
    return 'Start date must use YYYY-MM-DD format.';
  }

  return null;
}

function projectFromBody(body) {
  return {
    name: String(body.name).trim(),
    description: String(body.description).trim(),
    category: String(body.category).trim(),
    organization: String(body.organization).trim(),
    location: String(body.location).trim(),
    startDate: String(body.startDate).trim(),
    status: String(body.status).trim().toLowerCase()
  };
}

async function getAll(req, res) {
  try {
    const projects = await getDb().collection('projects').find().sort({ startDate: 1 }).toArray();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve projects.', error: error.message });
  }
}

async function getSingle(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project id.' });
    }

    const project = await getDb().collection('projects').findOne({ _id: new ObjectId(req.params.id) });

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve project.', error: error.message });
  }
}

async function createProject(req, res) {
  try {
    const validationError = validateProject(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const project = projectFromBody(req.body);
    const result = await getDb().collection('projects').insertOne(project);

    return res.status(201).json({
      message: 'Project created successfully.',
      id: result.insertedId,
      project
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create project.', error: error.message });
  }
}

async function updateProject(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project id.' });
    }

    const validationError = validateProject(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await getDb().collection('projects').replaceOne(
      { _id: new ObjectId(req.params.id) },
      projectFromBody(req.body)
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    return res.status(200).json({ message: 'Project updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update project.', error: error.message });
  }
}

async function deleteProject(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project id.' });
    }

    const result = await getDb().collection('projects').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    return res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete project.', error: error.message });
  }
}

module.exports = { getAll, getSingle, createProject, updateProject, deleteProject };
