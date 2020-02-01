var auth = require("../controllers/authentication");
var db = require("../models");
var passport = require("passport");

module.exports = function(app) {
    app.get("/admin/login", (req, res) => {
        res.render("login", { layout: null });
    });

    app.post(
        "/admin/login",
        passport.authenticate("local", {
            successRedirect: "/admin/loginRedirect",
            failureRedirect: "/admin/login",
            failureFlash: false // I'm the only user - not feeling the need to give myself "incorrect password" messages
        })
    );

    app.get("/admin/loginRedirect", (req, res) => {
        res.redirect(req.session.returnTo || "/admin/home");
    });

    app.get("/admin/home", auth.secureRoute, (req, res) => {
        res.render("home", { layout: "admin" });
    });

    app.get("/admin/projects", auth.secureRoute, (req, res) => {
        db.project.findAll({}).then(projects => {
            const allProjects = projects.map(project => {
                return {
                    name: project.name,
                    id: project.id
                };
            });
            res.render("projects", { projects: allProjects, layout: "admin" });
        });
    });

    app.get("/admin/projects/:id", auth.secureRoute, (req, res) => {
        db.project
            .findOne({
                where: {
                    id: req.params.id
                },
                include: [
                    {
                        model: db.link
                    },
                    {
                        model: db.software,
                        as: "stack"
                    }
                ]
            })
            .then(project => {
                const proj = {
                    name: project.name,
                    description: project.description,
                    imagePath: project.imagePath,
                    links: project.links.map(link => {
                        return {
                            name: link.name,
                            url: link.url
                        };
                    }),
                    stack: project.stack.map(software => {
                        return {
                            name: software.name
                        };
                    })
                };
                db.software.findAll({}).then(software => {
                    const soft = software.map(s => {
                        console.log(s.dataValues.name);
                        return {
                            id: s.id,
                            name: s.name
                        };
                    });

                    proj.stack.forEach(item => {
                        soft.forEach(softwareItem => {
                            if (!softwareItem.checked) {
                                let checked = softwareItem.name === item.name;
                                softwareItem.checked = checked;
                            }
                        });
                    });
                    res.render("project", {
                        project: proj,
                        software: soft,
                        layout: "admin"
                    });
                });
            });
    });

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
