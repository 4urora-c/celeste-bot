const { MongoClient } = require('mongodb');
const mongodburi  = process.env.DATABASE_STRING

const uri = mongodburi;
const client = new MongoClient(uri, {autoIndex: false});

module.exports = {
  connectDB: async () => {
    await client.connect();
    console.log('mongoDB is now connected!');
    return client;
  },
};
