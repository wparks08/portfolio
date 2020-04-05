const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const db = require("../models");
const passport = require("passport");

module.exports = {
    config: function() {
        passport.use(
            new LocalStrategy(function(username, password, done) {
                db.user.findOne({ where: { username: username } }).then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: "User not found"
                        });
                    }
                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, {
                            message: "Incorrect password"
                        });
                    }
                    return done(null, user);
                });
            })
        );

        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            db.user
                .findOne({
                    where: {
                        id: id
                    }
                })
                .then(user => {
                    done(null, user);
                });
        });
    },

    secureRoute: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.session.returnTo = req.originalUrl;
            res.redirect("/admin/login");
        }
    },

    authenticate: passport.authenticate("local", {
        successRedirect: "/admin/loginRedirect",
        failureRedirect: "/admin/login",
        failureFlash: false // I'm the only user - not feeling the need to give myself "incorrect password" messages
    })
};
