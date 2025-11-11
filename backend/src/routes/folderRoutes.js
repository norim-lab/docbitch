const express = require('express');
const router = express.Router();
const FolderController = require('../controllers/folderController');

// Get all folders
router.get('/', FolderController.getAll);

// Get single folder
router.get('/:id', FolderController.getById);

// Create folder
router.post('/', FolderController.create);

// Update folder
router.put('/:id', FolderController.update);

// Delete folder
router.delete('/:id', FolderController.delete);

module.exports = router;
