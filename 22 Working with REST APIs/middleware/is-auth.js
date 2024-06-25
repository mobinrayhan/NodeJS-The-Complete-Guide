const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token =
    req.get("Authorization") ||
    `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJheWhhbnVkZGlubW9iaW5AZ21haWwuY29tIiwiaWQiOiI2Njc5YzNhYjgyM2IwOWNjMGJiMDhiZTMiLCJpYXQiOjE3MTkzMTE4NjQsImV4cCI6MTcxOTMxNTQ2NH0.eIgMKI72LBk29PflvZq8FfaRjUAZUpl6MWgftUhm5dQ`;

  if (!token) {
    const error = new Error("User is not authenticated!");
    error.statusCode = 401;
    throw error;
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkbTI0MTQwNUBnbWFpbC5jb20iLCJpZCI6IjY2N2FhOWFiNjE4YjIyOWNhODM0ZmM4ZiIsImlhdCI6MTcxOTMxNDg3MSwiZXhwIjoxNzE5MzE4NDcxfQ.2g1xotMp-pMqeIxVdq79Jl6W2PvsZi2l6zk2b9RB0B8`,
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
