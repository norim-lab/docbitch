-- Simplified schema for manual import
-- Copy and paste this into Railway MySQL Query interface

CREATE TABLE IF NOT EXISTS folders (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, description TEXT, color VARCHAR(7) DEFAULT '#3B82F6', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS documents (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255) NOT NULL, description TEXT, file_name VARCHAR(255) NOT NULL, file_path VARCHAR(512) NOT NULL, file_type VARCHAR(100) NOT NULL, file_size BIGINT NOT NULL, folder_id INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tags (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL UNIQUE, color VARCHAR(7) DEFAULT '#6B7280', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS document_tags (document_id INT NOT NULL, tag_id INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (document_id, tag_id), FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE, FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO folders (name, description, color) VALUES ('Rechnungen', 'Rechnungen und Belege', '#EF4444'), ('Verträge', 'Wichtige Verträge', '#3B82F6'), ('Persönliche Dokumente', 'Ausweise, Zeugnisse', '#10B981'), ('Sonstiges', 'Verschiedene Dokumente', '#6B7280');

INSERT INTO tags (name, color) VALUES ('Wichtig', '#EF4444'), ('Archiv', '#6B7280'), ('Zu bearbeiten', '#F59E0B'), ('Erledigt', '#10B981');
