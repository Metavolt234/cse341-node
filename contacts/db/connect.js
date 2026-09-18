const { MongoClient } = require('mongodb');

let database;
let client;

async function connectDb() {
  if (database) return database;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined. Add it to your .env file or Render environment variables.');
  }

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  database = client.db('cse341');
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
  }
}

module.exports = { connectDb, getDb, closeDb };
