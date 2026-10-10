const express = require('express');
const controller = require('../controllers/projects');
const { requireLogin } = require('../auth');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);
router.post('/', requireLogin, controller.createProject);
router.put('/:id', requireLogin, controller.updateProject);
router.delete('/:id', requireLogin, controller.deleteProject);

module.exports = router;
