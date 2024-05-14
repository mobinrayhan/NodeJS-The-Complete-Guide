const fs = require("node:fs");
const path = require("node:path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "product.json",
);

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this.id = id;
  }

  save() {
    let products = [];

    console.log(this);
    if (this.id) {
      fs.readFile(p, (err, fileContent) => {
        if (err) {
          console.log(err);
        } else {
          const oldProduct = JSON.parse(fileContent);
          products = oldProduct.filter((p) => p.id !== this.id);
          products.push(this);
        }

        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      });
    } else {
      this.id = crypto.randomUUID();

      fs.readFile(p, (err, fileContent) => {
        if (err) {
          products.push(this);
        } else {
          const oldProduct = JSON.parse(fileContent);
          oldProduct.push(this);
          products = oldProduct;
        }

        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err, "asdf");
        });
      });
    }
  }

  static fetchAll(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }

  static getById(id, cb) {
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        const products = JSON.parse(fileContent);
        const proudct = products.find((product) => product.id === id);
        cb(proudct);
      }
    });
  }

  static deleteById(id, cb) {
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        const products = JSON.parse(fileContent);
        const updatedProducts = products.filter((product) => product.id !== id);

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err, "asdf");
          cb();
        });
      }
    });
  }
};
