const express = require('express');
const controller = require('../controllers/projects');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);
router.post('/', controller.createProject);
router.put('/:id', controller.updateProject);
router.delete('/:id', controller.deleteProject);

module.exports = router;
