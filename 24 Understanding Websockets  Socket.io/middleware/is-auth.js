const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token =
    req.get("Authorization") ||
    `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkbTI0MTQwNUBnbWFpbC5jb20iLCJpZCI6IjY2N2JkN2Y4OGQ3Mjk2ZDE2MTZmMzQwNSIsImlhdCI6MTcxOTQyODA4NywiZXhwIjoxNzE5NDMxNjg3fQ.nblqYfkn9LMn3ExyVZVLhHt_wXXS60ewlnKJFAL7aTw`;

  if (!token) {
    const error = new Error("User is not authenticated!");
    error.statusCode = 401;
    throw error;
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkbTI0MTQwNUBnbWFpbC5jb20iLCJpZCI6IjY2N2JkN2Y4OGQ3Mjk2ZDE2MTZmMzQwNSIsImlhdCI6MTcxOTQyODA4NywiZXhwIjoxNzE5NDMxNjg3fQ.nblqYfkn9LMn3ExyVZVLhHt_wXXS60ewlnKJFAL7aTw`,
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
  req.userId = decodedToken.id;
  next();
};
