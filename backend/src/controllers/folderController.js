const Folder = require('../models/Folder');

class FolderController {
  // Get all folders
  static async getAll(req, res) {
    try {
      const folders = await Folder.findAll();
      res.json(folders);
    } catch (error) {
      console.error('Error fetching folders:', error);
      res.status(500).json({ error: 'Failed to fetch folders' });
    }
  }

  // Get single folder
  static async getById(req, res) {
    try {
      const folder = await Folder.findById(req.params.id);
      if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
      }
      res.json(folder);
    } catch (error) {
      console.error('Error fetching folder:', error);
      res.status(500).json({ error: 'Failed to fetch folder' });
    }
  }

  // Create folder
  static async create(req, res) {
    try {
      const { name, description, color } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Folder name is required' });
      }

      const folder = await Folder.create({ name, description, color });
      res.status(201).json(folder);
    } catch (error) {
      console.error('Error creating folder:', error);
      res.status(500).json({ error: 'Failed to create folder' });
    }
  }

  // Update folder
  static async update(req, res) {
    try {
      const { name, description, color } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Folder name is required' });
      }

      const folder = await Folder.update(req.params.id, { name, description, color });
      if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
      }

      res.json(folder);
    } catch (error) {
      console.error('Error updating folder:', error);
      res.status(500).json({ error: 'Failed to update folder' });
    }
  }

  // Delete folder
  static async delete(req, res) {
    try {
      const deleted = await Folder.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Folder not found' });
      }

      res.json({ message: 'Folder deleted successfully' });
    } catch (error) {
      if (error.message === 'Cannot delete folder with documents') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error deleting folder:', error);
      res.status(500).json({ error: 'Failed to delete folder' });
    }
  }
}

module.exports = FolderController;
