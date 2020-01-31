var auth = require("../controllers/authentication");
var db = require("../models");
var bcrypt = require("bcryptjs");
var passport = require("passport");

module.exports = function(app) {
    app.get("/admin/login", (req, res) => {
        res.render("login", { layout: null });
    });

    app.post(
        "/admin/login",
        passport.authenticate("local", {
            successRedirect: "/admin/home",
            failureRedirect: "/admin/login",
            failureFlash: false // I'm the only user - not feeling the need to give myself "incorrect password" messages
        })
    );

    app.get("/admin/home", auth.secureRoute, (req, res) => {
        res.render("home", { layout: "admin" });
    });
};
