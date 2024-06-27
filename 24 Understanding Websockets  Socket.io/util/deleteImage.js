const fs = require("node:fs");
const path = require("node:path");

function deleteImage(imageUrl) {
  fs.unlinkSync(path.join(path.dirname(require.main.filename), imageUrl));
}

module.exports = deleteImage;
