const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token =
    req.get("Authorization") ||
    `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkbTI0MTQwNUBnbWFpbC5jb20iLCJpZCI6IjY2N2FhOWFiNjE4YjIyOWNhODM0ZmM4ZiIsImlhdCI6MTcxOTMyMDM4NCwiZXhwIjoxNzE5MzIzOTg0fQ.DX8hKKg4Rw07G52fbydHlD9wkYnbzNKbgbwdKMTNwT8`;

  if (!token) {
    const error = new Error("User is not authenticated!");
    error.statusCode = 401;
    throw error;
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkbTI0MTQwNUBnbWFpbC5jb20iLCJpZCI6IjY2N2FhOWFiNjE4YjIyOWNhODM0ZmM4ZiIsImlhdCI6MTcxOTMyMDM4NCwiZXhwIjoxNzE5MzIzOTg0fQ.DX8hKKg4Rw07G52fbydHlD9wkYnbzNKbgbwdKMTNwT8`,
      process.env.JWT_PRIVATE_kEY,
    );
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("User is not authenticated!");
    error.statusCode = 401;
    throw error;
  }

  console.log(decodedToken);
  req.userId = decodedToken.id;
  next();
};
