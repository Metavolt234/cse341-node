const express = require('express');
const controller = require('../controllers/contacts');
const { requireLogin } = require('../auth');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);
router.post('/', requireLogin, controller.createContact);
router.put('/:id', requireLogin, controller.updateContact);
router.delete('/:id', requireLogin, controller.deleteContact);

module.exports = router;
