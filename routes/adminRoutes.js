const auth = require("../util/authentication");
const db = require("../models");

module.exports = function(app) {
    app.get("/admin/software", auth.secureRoute, (req, res) => {
        db.software.findAll({}).then(software => {
            const soft = software.map(s => {
                return {
                    name: s.name
                };
            });
            res.render("software", { software: soft, layout: "admin" });
        });
    });

    app.post("/admin/software", auth.secureRoute, (req, res) => {
        const newSoftware = {
            name: req.body.name
        };

        db.software.create(newSoftware).then(() => {
            res.redirect("/admin/software");
        });
    });
};






