const Tag = require('../models/Tag');

class TagController {
  // Get all tags
  static async getAll(req, res) {
    try {
      const tags = await Tag.findAll();
      res.json(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({ error: 'Failed to fetch tags' });
    }
  }

  // Get single tag
  static async getById(req, res) {
    try {
      const tag = await Tag.findById(req.params.id);
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      res.json(tag);
    } catch (error) {
      console.error('Error fetching tag:', error);
      res.status(500).json({ error: 'Failed to fetch tag' });
    }
  }

  // Create tag
  static async create(req, res) {
    try {
      const { name, color } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Tag name is required' });
      }

      const tag = await Tag.create({ name, color });
      res.status(201).json(tag);
    } catch (error) {
      console.error('Error creating tag:', error);
      res.status(500).json({ error: 'Failed to create tag' });
    }
  }

  // Update tag
  static async update(req, res) {
    try {
      const { name, color } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Tag name is required' });
      }

      const tag = await Tag.update(req.params.id, { name, color });
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      res.json(tag);
    } catch (error) {
      console.error('Error updating tag:', error);
      res.status(500).json({ error: 'Failed to update tag' });
    }
  }

  // Delete tag
  static async delete(req, res) {
    try {
      const deleted = await Tag.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
      console.error('Error deleting tag:', error);
      res.status(500).json({ error: 'Failed to delete tag' });
    }
  }
}

module.exports = TagController;
