const { pool } = require('../config/database');

class Document {
  // Get all documents with optional filters
  static async findAll(filters = {}) {
    let conn;
    try {
      conn = await pool.getConnection();
      let query = `
        SELECT d.*,
               f.name as folder_name,
               GROUP_CONCAT(t.name) as tags
        FROM documents d
        LEFT JOIN folders f ON d.folder_id = f.id
        LEFT JOIN document_tags dt ON d.id = dt.document_id
        LEFT JOIN tags t ON dt.tag_id = t.id
        WHERE 1=1
      `;
      const params = [];

      if (filters.folderId) {
        query += ' AND d.folder_id = ?';
        params.push(filters.folderId);
      }

      if (filters.search) {
        query += ' AND (d.title LIKE ? OR d.description LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ' GROUP BY d.id ORDER BY d.created_at DESC';

      const rows = await conn.query(query, params);
      return rows;
    } finally {
      if (conn) conn.release();
    }
  }

  // Get document by ID
  static async findById(id) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = `
        SELECT d.*,
               f.name as folder_name,
               GROUP_CONCAT(t.name) as tags
        FROM documents d
        LEFT JOIN folders f ON d.folder_id = f.id
        LEFT JOIN document_tags dt ON d.id = dt.document_id
        LEFT JOIN tags t ON dt.tag_id = t.id
        WHERE d.id = ?
        GROUP BY d.id
      `;
      const rows = await conn.query(query, [id]);
      return rows[0] || null;
    } finally {
      if (conn) conn.release();
    }
  }

  // Create new document
  static async create(documentData) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = `
        INSERT INTO documents (title, description, file_name, file_path, file_type, file_size, folder_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await conn.query(query, [
        documentData.title,
        documentData.description || null,
        documentData.fileName,
        documentData.filePath,
        documentData.fileType,
        documentData.fileSize,
        documentData.folderId || null
      ]);
      return { id: Number(result.insertId), ...documentData };
    } finally {
      if (conn) conn.release();
    }
  }

  // Update document
  static async update(id, documentData) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = `
        UPDATE documents
        SET title = ?, description = ?, folder_id = ?, updated_at = NOW()
        WHERE id = ?
      `;
      await conn.query(query, [
        documentData.title,
        documentData.description,
        documentData.folderId || null,
        id
      ]);
      return this.findById(id);
    } finally {
      if (conn) conn.release();
    }
  }

  // Delete document
  static async delete(id) {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query('DELETE FROM document_tags WHERE document_id = ?', [id]);
      const result = await conn.query('DELETE FROM documents WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  }

  // Add tags to document
  static async addTags(documentId, tagIds) {
    let conn;
    try {
      conn = await pool.getConnection();
      for (const tagId of tagIds) {
        await conn.query(
          'INSERT IGNORE INTO document_tags (document_id, tag_id) VALUES (?, ?)',
          [documentId, tagId]
        );
      }
    } finally {
      if (conn) conn.release();
    }
  }

  // Remove tags from document
  static async removeTags(documentId, tagIds) {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(
        'DELETE FROM document_tags WHERE document_id = ? AND tag_id IN (?)',
        [documentId, tagIds]
      );
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = Document;
