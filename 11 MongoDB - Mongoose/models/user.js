const { getDB } = require("../util/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; //{items: [{productID: 1, quantity: 5}]}
    this._id = id;
  }

  static findById(id) {
    const db = getDB();
    const users = db.collection("user");
    const user = users.findOne(new ObjectId(id));
    return user;
  }

  addToCart(product) {
    const existingProdIndex = this.cart.items.findIndex(
      (p) => p.productId.toString() === product._id.toString(),
    );

    const updatedCartItems = [...this.cart.items];

    let newQueantity = 1;
    if (existingProdIndex >= 0) {
      newQueantity = this.cart.items[existingProdIndex].quantity + newQueantity;
      updatedCartItems[existingProdIndex].quantity = newQueantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQueantity });
    }

    const cartItems = { items: updatedCartItems };

    const db = getDB();
    const users = db.collection("user");
    return users.updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: cartItems } },
    );
  }

  getCart() {
    const db = getDB();

    const productsIDs = this.cart.items.map((p) => p.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productsIDs } })
      .toArray()
      .then((products) =>
        products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find(
              (i) => i.productId.toString() === p._id.toString(),
            ).quantity,
          };
        }),
      );
  }

  addOrder() {
    const db = getDB();

    return this.getCart()
      .then((products) => {
        const order = {
          products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };

        return db.collection("orders").insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };

        return db
          .collection("user")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } },
          );
      })
      .catch((err) => console.log(err));
  }

  getOrders() {
    const db = getDB();

    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }

  deleteCartItem(id) {
    const cartItems = [...this.cart.items];
    const updatedItems = cartItems.filter(
      (i) => i.productId.toString() !== id.toString(),
    );

    const db = getDB();
    const users = db.collection("user");
    return users.updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: { items: updatedItems } } },
    );
  }

  save() {
    const db = getDB();
    const users = db.collection("user");
    return users.insertOne(this).next();
  }
}

module.exports = User;
