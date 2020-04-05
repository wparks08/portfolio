const db = require("../models");

const Software = function(obj) {
    this.id = obj.id;
    this.name = obj.name;
};

module.exports = {
    findAll: (req, res) => {
        db.software.findAll({}).then(software => {
            const soft = software.map(s => new Software(s));
            res.render("software", { software: soft, layout: "admin" });
        });
    },

    insert: (req, res) => {
        const newSoftware = {
            name: req.body.name
        };

        db.software.create(newSoftware).then(() => {
            res.redirect("/admin/software");
        });
    }
};
