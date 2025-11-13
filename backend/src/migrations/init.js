const { pool } = require('../config/database');

async function runMigrations() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('📝 Running database migrations...\n');

    // Create folders table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS folders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#3B82F6',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table "folders" ready');

    // Create documents table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(512) NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size BIGINT NOT NULL,
        folder_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
        INDEX idx_title (title),
        INDEX idx_folder (folder_id),
        INDEX idx_file_type (file_type),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table "documents" ready');

    // Create tags table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        color VARCHAR(7) DEFAULT '#6B7280',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table "tags" ready');

    // Create document_tags junction table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS document_tags (
        document_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (document_id, tag_id),
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
        INDEX idx_document (document_id),
        INDEX idx_tag (tag_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table "document_tags" ready');

    // Insert default folders if table is empty
    const folderCount = await conn.query('SELECT COUNT(*) as count FROM folders');
    if (folderCount[0].count === 0) {
      await conn.query(`
        INSERT INTO folders (name, description, color) VALUES
        ('Rechnungen', 'Rechnungen und Belege', '#EF4444'),
        ('Verträge', 'Wichtige Verträge und Vereinbarungen', '#3B82F6'),
        ('Persönliche Dokumente', 'Ausweise, Zeugnisse etc.', '#10B981'),
        ('Sonstiges', 'Verschiedene Dokumente', '#6B7280')
      `);
      console.log('✅ Default folders created');
    }

    // Insert default tags if table is empty
    const tagCount = await conn.query('SELECT COUNT(*) as count FROM tags');
    if (tagCount[0].count === 0) {
      await conn.query(`
        INSERT INTO tags (name, color) VALUES
        ('Wichtig', '#EF4444'),
        ('Archiv', '#6B7280'),
        ('Zu bearbeiten', '#F59E0B'),
        ('Erledigt', '#10B981')
      `);
      console.log('✅ Default tags created');
    }

    console.log('\n✅ Database migrations completed successfully!\n');
    return true;
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { runMigrations };
