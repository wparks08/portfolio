var auth = require("../controllers/authentication");
var db = require("../models");
var passport = require("passport");
var s3 = require("../controllers/awss3");

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

    app.get("/admin/projects/create", auth.secureRoute, (req, res) => {
        res.render("createProject", { layout: "admin" });
    });

    app.post("/admin/projects/create", auth.secureRoute, (req, res) => {
        let newProject = {
            name: req.body.name,
            description: req.body.description
        };
        db.project.create(newProject).then(project => {
            res.redirect("/admin/projects/" + project.id);
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
                const proj = mapProject(project);
                db.software.findAll({}).then(software => {
                    const soft = mapSoftware(software);
                    addCheckedPropertyToSoftware(proj, soft);
                    res.render("project", {
                        project: proj,
                        software: soft,
                        layout: "admin"
                    });
                });
            });
    });

    app.post("/admin/projects/:id/update", auth.secureRoute, (req, res) => {
        let projectValues = {
            name: req.body.name,
            description: req.body.description
        };

        if (req.files) {
            let image = req.files.image;
            s3.upload(image.name, image.data);
            projectValues.imagePath = image.name;
        }

        db.project.update(projectValues, { where: { id: req.params.id } }).then(() => {
            res.redirect("/admin/projects/" + req.params.id);
        });
    });

    app.post("/admin/projects/:id/addLink", auth.secureRoute, (req, res) => {
        const newLink = {
            name: req.body.name,
            url: req.body.url
        };
        db.project
            .findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(project => {
                db.link.create(newLink).then(link => {
                    project.addLink(link).then(() => {
                        res.sendStatus(200);
                    });
                });
            });
    });

    app.post("/admin/projects/:id/updateStack", auth.secureRoute, (req, res) => {
        let updatedStack = req.body["updatedStack[]"];
        db.project
            .findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(project => {
                project.setStack(updatedStack);
                res.sendStatus(200);
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

function mapProject(project) {
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        imagePath: project.imagePath,
        links: mapLinks(project.links),
        stack: mapSoftware(project.stack)
    };
}

function mapSoftware(software) {
    return software.map(s => {
        return {
            id: s.id,
            name: s.name
        };
    });
}

function mapLinks(links) {
    return links.map(link => {
        return {
            name: link.name,
            url: link.url
        };
    });
}

function addCheckedPropertyToSoftware(proj, soft) {
    proj.stack.forEach(item => {
        soft.forEach(softwareItem => {
            if (!softwareItem.checked) {
                softwareItem.checked = softwareItem.name === item.name;
            }
        });
    });
}
