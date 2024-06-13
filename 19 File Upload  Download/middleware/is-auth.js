exports.userAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  }

  res.redirect("/login");
};

// exports.userAuth = (req, res, next) => {
//   if (req.session.isLoggedIn) {
//     if (["/login", "/reset", "/signup"].includes(req.url)) {
//       return res.redirect("/");
//     }
//     return next();
//   } else {
//     if (["/login", "/reset", "/signup"].includes(req.url)) {
//       return next();
//     } else {
//       return res.redirect("/login");
//     }
//   }
// };
