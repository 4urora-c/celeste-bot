const { MongoClient } = require('mongodb');
const mongodburi  = 'mongodb://localhost:27017/databaseName'

const uri = mongodburi;
const client = new MongoClient(uri, {autoIndex: false});

module.exports = {
  connectDB: async () => {
    await client.connect({autoIndex: false});
    console.log('mongoDB is now connected!');
    return client;
  },
};
