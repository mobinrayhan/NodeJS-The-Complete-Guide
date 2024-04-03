exports.get404 = (req, res, next) => {
  console.log(req.body);
  res.status(404).render("404", { title: "Page Not Found", path: "*" });
};
