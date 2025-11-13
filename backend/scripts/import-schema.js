const mariadb = require('mariadb');
const fs = require('fs').promises;
const path = require('path');
const { URL } = require('url');
require('dotenv').config();

async function importSchema() {
  console.log('🔄 Starting schema import...\n');

  // Parse connection from MYSQL_URL
  let dbConfig;
  const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

  if (connectionUrl) {
    const url = new URL(connectionUrl);
    dbConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
      multipleStatements: true
    };
  } else {
    console.error('❌ No MYSQL_URL found in environment variables');
    process.exit(1);
  }

  console.log('📡 Connecting to database...');
  console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`   Database: ${dbConfig.database}\n`);

  let conn;
  try {
    // Create connection
    conn = await mariadb.createConnection(dbConfig);
    console.log('✅ Connected to database\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '../../database/schema-railway.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');

    console.log('📝 Executing SQL schema...\n');

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          await conn.query(statement);

          // Log what was created
          if (statement.includes('CREATE TABLE')) {
            const tableName = statement.match(/CREATE TABLE.*?`?(\w+)`?\s*\(/i)?.[1];
            console.log(`✅ Created table: ${tableName}`);
          } else if (statement.includes('INSERT INTO')) {
            const tableName = statement.match(/INSERT INTO\s+`?(\w+)`?/i)?.[1];
            console.log(`✅ Inserted data into: ${tableName}`);
          }
        } catch (err) {
          // Ignore "table already exists" errors
          if (!err.message.includes('already exists')) {
            console.error(`❌ Error executing statement: ${err.message}`);
          }
        }
      }
    }

    console.log('\n🎉 Schema import completed successfully!');
    console.log('\nCreated tables:');
    const tables = await conn.query('SHOW TABLES');
    tables.forEach(row => {
      const tableName = Object.values(row)[0];
      console.log(`   - ${tableName}`);
    });

  } catch (error) {
    console.error('\n❌ Error importing schema:', error.message);
    process.exit(1);
  } finally {
    if (conn) {
      await conn.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

importSchema();
