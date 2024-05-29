const { MongoClient } = require("mongodb");

const uri = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@nodejs1.gl4wmlm.mongodb.net/?retryWrites=true&w=majority&appName=NodeJs1`;

let _db;

const mongoConnect = (callback) => {
  new MongoClient(uri)
    .connect()
    .then((client) => {
      _db = client.db("node_shop");
      callback();
    })
    .catch((err) => console.log(err));
};

const getDB = () => {
  if (_db) {
    return _db;
  }

  throw new Error("Database not found");
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
