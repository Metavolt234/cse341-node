const { MongoClient } = require('mongodb');

let client;
let database;

async function connectDb() {
  if (database) return database;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined. Add it to .env locally or Render Environment Variables.');
  }

  const dbName = process.env.DB_NAME || 'cse341_w03_project2';

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  database = client.db(dbName);

  return database;
}

function getDb() {
  if (!database) {
    throw new Error('Database has not been initialized.');
  }
  return database;
}

async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}

module.exports = { connectDb, getDb, closeDb };
