const express = require('express');
const controller = require('../controllers/contacts');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);
router.post('/', controller.createContact);
router.put('/:id', controller.updateContact);
router.delete('/:id', controller.deleteContact);

module.exports = router;
