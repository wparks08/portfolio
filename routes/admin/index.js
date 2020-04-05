module.exports = function(app) {
    app.use("/admin", require("./userRoutes"));
    app.use("/admin", require("./htmlRoutes"));
    app.use("/admin", require("./projectRoutes"));
};
