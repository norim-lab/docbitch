const { pool } = require('../config/database');

class Tag {
  // Get all tags
  static async findAll() {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = `
        SELECT t.*,
               COUNT(dt.document_id) as usage_count
        FROM tags t
        LEFT JOIN document_tags dt ON t.id = dt.tag_id
        GROUP BY t.id
        ORDER BY t.name ASC
      `;
      const rows = await conn.query(query);
      return rows;
    } finally {
      if (conn) conn.release();
    }
  }

  // Get tag by ID
  static async findById(id) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM tags WHERE id = ?', [id]);
      return rows[0] || null;
    } finally {
      if (conn) conn.release();
    }
  }

  // Create new tag
  static async create(tagData) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = 'INSERT INTO tags (name, color) VALUES (?, ?)';
      const result = await conn.query(query, [
        tagData.name,
        tagData.color || '#6B7280'
      ]);
      return { id: Number(result.insertId), ...tagData };
    } finally {
      if (conn) conn.release();
    }
  }

  // Update tag
  static async update(id, tagData) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = 'UPDATE tags SET name = ?, color = ? WHERE id = ?';
      await conn.query(query, [tagData.name, tagData.color, id]);
      return this.findById(id);
    } finally {
      if (conn) conn.release();
    }
  }

  // Delete tag
  static async delete(id) {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query('DELETE FROM document_tags WHERE tag_id = ?', [id]);
      const result = await conn.query('DELETE FROM tags WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = Tag;
