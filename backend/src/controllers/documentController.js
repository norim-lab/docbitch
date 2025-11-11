const Document = require('../models/Document');
const fs = require('fs').promises;
const path = require('path');

class DocumentController {
  // Get all documents
  static async getAll(req, res) {
    try {
      const { folderId, search } = req.query;
      const filters = {};

      if (folderId) filters.folderId = folderId;
      if (search) filters.search = search;

      const documents = await Document.findAll(filters);
      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }

  // Get single document
  static async getById(req, res) {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ error: 'Failed to fetch document' });
    }
  }

  // Upload and create document
  static async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const documentData = {
        title: req.body.title || req.file.originalname,
        description: req.body.description,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        folderId: req.body.folderId || null
      };

      const document = await Document.create(documentData);

      // Add tags if provided
      if (req.body.tags) {
        const tagIds = JSON.parse(req.body.tags);
        if (Array.isArray(tagIds) && tagIds.length > 0) {
          await Document.addTags(document.id, tagIds);
        }
      }

      res.status(201).json(document);
    } catch (error) {
      console.error('Error uploading document:', error);
      // Delete uploaded file if database insert fails
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      res.status(500).json({ error: 'Failed to upload document' });
    }
  }

  // Update document
  static async update(req, res) {
    try {
      const { title, description, folderId } = req.body;
      const document = await Document.update(req.params.id, {
        title,
        description,
        folderId
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.json(document);
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Failed to update document' });
    }
  }

  // Delete document
  static async delete(req, res) {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Delete file from filesystem
      await fs.unlink(document.file_path).catch(console.error);

      // Delete from database
      await Document.delete(req.params.id);

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  }

  // Download document
  static async download(req, res) {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.download(document.file_path, document.file_name);
    } catch (error) {
      console.error('Error downloading document:', error);
      res.status(500).json({ error: 'Failed to download document' });
    }
  }

  // Add tags to document
  static async addTags(req, res) {
    try {
      const { tagIds } = req.body;
      if (!Array.isArray(tagIds) || tagIds.length === 0) {
        return res.status(400).json({ error: 'Invalid tag IDs' });
      }

      await Document.addTags(req.params.id, tagIds);
      const document = await Document.findById(req.params.id);
      res.json(document);
    } catch (error) {
      console.error('Error adding tags:', error);
      res.status(500).json({ error: 'Failed to add tags' });
    }
  }

  // Remove tags from document
  static async removeTags(req, res) {
    try {
      const { tagIds } = req.body;
      if (!Array.isArray(tagIds) || tagIds.length === 0) {
        return res.status(400).json({ error: 'Invalid tag IDs' });
      }

      await Document.removeTags(req.params.id, tagIds);
      const document = await Document.findById(req.params.id);
      res.json(document);
    } catch (error) {
      console.error('Error removing tags:', error);
      res.status(500).json({ error: 'Failed to remove tags' });
    }
  }
}

module.exports = DocumentController;
