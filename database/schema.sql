-- docbitch Database Schema for MariaDB
-- Create this database on your server before running the application

-- Create database
CREATE DATABASE IF NOT EXISTS docbitch_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE docbitch_db;

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Documents table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#6B7280',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Document-Tags junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS document_tags (
  document_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (document_id, tag_id),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  INDEX idx_document (document_id),
  INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some default folders
INSERT INTO folders (name, description, color) VALUES
  ('Rechnungen', 'Rechnungen und Belege', '#EF4444'),
  ('Verträge', 'Wichtige Verträge und Vereinbarungen', '#3B82F6'),
  ('Persönliche Dokumente', 'Ausweise, Zeugnisse etc.', '#10B981'),
  ('Sonstiges', 'Verschiedene Dokumente', '#6B7280');

-- Insert some default tags
INSERT INTO tags (name, color) VALUES
  ('Wichtig', '#EF4444'),
  ('Archiv', '#6B7280'),
  ('Zu bearbeiten', '#F59E0B'),
  ('Erledigt', '#10B981');

-- Create user for the application (adjust credentials as needed)
-- Run this separately with root privileges:
-- CREATE USER IF NOT EXISTS 'docbitch_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON docbitch_db.* TO 'docbitch_user'@'localhost';
-- FLUSH PRIVILEGES;
