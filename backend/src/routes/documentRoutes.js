const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/documentController');
const upload = require('../middleware/upload');

// Get all documents (with optional filters)
router.get('/', DocumentController.getAll);

// Get single document
router.get('/:id', DocumentController.getById);

// Upload new document
router.post('/', upload.single('file'), DocumentController.upload);

// Update document
router.put('/:id', DocumentController.update);

// Delete document
router.delete('/:id', DocumentController.delete);

// Download document
router.get('/:id/download', DocumentController.download);

// Tag management
router.post('/:id/tags', DocumentController.addTags);
router.delete('/:id/tags', DocumentController.removeTags);

module.exports = router;
