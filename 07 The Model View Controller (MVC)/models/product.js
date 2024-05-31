const { readFile, writeFile } = require("fs");
const path = require("path");
const rootPath = require("../util/path");

const p = path.join(rootPath, "data", "products.json");

function getProductFromFile(cb) {
  readFile(p, (err, productData) => {
    if (err || !productData.toString()) {
      return cb([]);
    }

    const data = JSON.parse(productData);
    cb(data);
  });
}

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductFromFile((products) => {
      products.push(this);
      writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAllProduct(cb) {
    getProductFromFile(cb);
  }
};