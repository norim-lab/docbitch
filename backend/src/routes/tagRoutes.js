const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController');

// Get all tags
router.get('/', TagController.getAll);

// Get single tag
router.get('/:id', TagController.getById);

// Create tag
router.post('/', TagController.create);

// Update tag
router.put('/:id', TagController.update);

// Delete tag
router.delete('/:id', TagController.delete);

module.exports = router;
