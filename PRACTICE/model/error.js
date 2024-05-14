exports.pageNotFound = (req, res) => {
  res
    .status(404)
    .render("404.ejs", { pageTitle: "Page Not Found", path: null });
};
