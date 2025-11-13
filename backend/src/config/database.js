const mariadb = require('mariadb');
const { URL } = require('url');
require('dotenv').config();

// Parse MySQL URL if available
function parseMySQLUrl(urlString) {
  try {
    const url = new URL(urlString);
    return {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1) // Remove leading slash
    };
  } catch (err) {
    console.error('Failed to parse MySQL URL:', err.message);
    return null;
  }
}

// Support both Railway URL and individual environment variables
let dbConfig;

if (process.env.MYSQL_URL || process.env.DATABASE_URL) {
  // Use connection URL if available (Railway preferred method)
  const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;
  console.log('Using MySQL connection URL');

  dbConfig = parseMySQLUrl(connectionUrl);
  if (!dbConfig) {
    console.error('Failed to parse MySQL URL, falling back to environment variables');
    dbConfig = {
      host: process.env.MYSQLHOST || 'localhost',
      port: parseInt(process.env.MYSQLPORT || '3306'),
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE
    };
  }
} else {
  // Use individual environment variables
  console.log('Using individual MySQL environment variables');
  dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE
  };
}

console.log('Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  hasPassword: !!dbConfig.password
});

const pool = mariadb.createPool({
  ...dbConfig,
  connectionLimit: 5,
  connectTimeout: 10000,
  ssl: { rejectUnauthorized: false }, // Required for Railway TCP Proxy
  permitLocalInfile: true
});

// Test database connection
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✓ Database connected successfully');
    return true;
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { pool, testConnection };
