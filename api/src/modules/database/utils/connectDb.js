const { MongoClient } = require("mongodb");

const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);

const connectDb = async () => {
  let db;

  try {
    const connection = await client.connect();
    db = connection.db(process.env.ATLAS_DB);
  } catch (e) {
    console.error(e);
  }

  return db;
};

module.exports = { connectDb };
