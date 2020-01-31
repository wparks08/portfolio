module.exports = function(app) {
    app.get("/", (req, res) => {
        res.locals.pageTitle = "This is the page title";
        res.render("index");
    });
};
