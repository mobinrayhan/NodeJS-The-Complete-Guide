const { getDB } = require("../util/database");
const { ObjectId } = require("mongodb");

class Product {
  constructor(title, imageUrl, price, description, id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this._id = id ? new ObjectId(id) : null;
    this.userId = new ObjectId(userId);
  }

  static findAll() {
    const db = getDB();
    const products = db.collection("products");
    return products.find().toArray();
  }

  static findById(id) {
    const db = getDB();
    const products = db.collection("products");
    return products.find({ _id: new ObjectId(id) }).next();
  }

  static deleteById(id) {
    const db = getDB();
    const products = db.collection("products");
    return products.deleteOne({ _id: new ObjectId(id) });
  }

  save() {
    const db = getDB();
    const products = db.collection("products");

    if (this._id) {
      return products.updateOne({ _id: this._id }, { $set: this });
    }
    return products.insertOne(this);
  }
}

module.exports = Product;
