const mariadb = require('mariadb');
require('dotenv').config();

// Support both Railway and custom environment variables
const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  connectionLimit: 5,
  connectTimeout: 10000
};

const pool = mariadb.createPool(dbConfig);

// Test database connection
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✓ Database connected successfully');
    console.log(`✓ Database: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`);
    return true;
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    console.error('Database config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });
    return false;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { pool, testConnection };
