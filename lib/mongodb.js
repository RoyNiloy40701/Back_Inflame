//lib/mongodb.js
export { MongoClient } from "mongodb";
export default async function connectToDtabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    return client.db();

  } catch (error) {
    console.error('Error connecting to MongoDb:', error)
    throw error;
  }

}
