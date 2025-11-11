const { pool } = require('../config/database');

class Folder {
  // Get all folders
  static async findAll() {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = `
        SELECT f.*,
               COUNT(d.id) as document_count
        FROM folders f
        LEFT JOIN documents d ON f.id = d.folder_id
        GROUP BY f.id
        ORDER BY f.name ASC
      `;
      const rows = await conn.query(query);
      return rows;
    } finally {
      if (conn) conn.release();
    }
  }

  // Get folder by ID
  static async findById(id) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = `
        SELECT f.*,
               COUNT(d.id) as document_count
        FROM folders f
        LEFT JOIN documents d ON f.id = d.folder_id
        WHERE f.id = ?
        GROUP BY f.id
      `;
      const rows = await conn.query(query, [id]);
      return rows[0] || null;
    } finally {
      if (conn) conn.release();
    }
  }

  // Create new folder
  static async create(folderData) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = 'INSERT INTO folders (name, description, color) VALUES (?, ?, ?)';
      const result = await conn.query(query, [
        folderData.name,
        folderData.description || null,
        folderData.color || '#3B82F6'
      ]);
      return { id: Number(result.insertId), ...folderData };
    } finally {
      if (conn) conn.release();
    }
  }

  // Update folder
  static async update(id, folderData) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = `
        UPDATE folders
        SET name = ?, description = ?, color = ?, updated_at = NOW()
        WHERE id = ?
      `;
      await conn.query(query, [
        folderData.name,
        folderData.description,
        folderData.color,
        id
      ]);
      return this.findById(id);
    } finally {
      if (conn) conn.release();
    }
  }

  // Delete folder
  static async delete(id) {
    let conn;
    try {
      conn = await pool.getConnection();
      // Check if folder has documents
      const docs = await conn.query('SELECT COUNT(*) as count FROM documents WHERE folder_id = ?', [id]);
      if (docs[0].count > 0) {
        throw new Error('Cannot delete folder with documents');
      }
      const result = await conn.query('DELETE FROM folders WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = Folder;
