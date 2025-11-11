const mariadb = require('mariadb');
require('dotenv').config();

// Support both Railway URL and individual environment variables
let pool;

if (process.env.MYSQL_URL || process.env.DATABASE_URL) {
  // Use connection URL if available (Railway preferred method)
  const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;
  console.log('Using MySQL connection URL');

  pool = mariadb.createPool({
    connectionString: connectionUrl,
    connectionLimit: 5,
    connectTimeout: 10000
  });
} else {
  // Fallback to individual environment variables
  const dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    connectionLimit: 5,
    connectTimeout: 10000
  };

  console.log('Using individual MySQL environment variables');
  console.log('Database config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
    hasPassword: !!dbConfig.password
  });

  pool = mariadb.createPool(dbConfig);
}

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
