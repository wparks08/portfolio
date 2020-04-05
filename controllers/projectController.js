const db = require("../models");

/*
TODO: This file needs to be refactored. Plenty of spots where code
      may be reused.
      Constructors would probably make this a lot more readable.
 */

module.exports = {
    getProjects: (req, res) => {
        res.locals.pageTitle = "Will Parks | Portfolio";

        getAllProjects()
            .then(processProjects)
            .then(allProjects => {
                res.render("index", {
                    projects: allProjects
                });
            })
            .catch(err => {
                res.render("500", { err });
            });
    },

    getAdminProjects: (req, res) => {
        db.project.findAll({}).then(projects => {
            const allProjects = projects.map(project => {
                return {
                    name: project.name,
                    id: project.id
                };
            });
            res.render("projects", { projects: allProjects, layout: "admin" });
        });
    },

    findOne: (req, res) => {
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
    },

    renderCreateProject: (req, res) => {
        res.render("createProject", { layout: "admin" });
    },

    insert: (req, res) => {
        const newProject = {
            name: req.body.name,
            description: req.body.description
        };
        db.project.create(newProject).then(project => {
            res.redirect("/admin/projects/" + project.id);
        });
    },

    update: (req, res) => {
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
    },

    addLink: (req, res) => {
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
    },

    updateStack: (req, res) => {
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
    }
};

function getAllProjects() {
    return new Promise((resolve, reject) => {
        db.project
            .findAll({
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
            .then(projects => {
                resolve(projects);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function processProjects(projects) {
    const sortedProjects = sortProjectsByOrder(projects);
    const animatedSortedProjects = addFadeToProjects(sortedProjects);
    return convertProjectsToOwnObjects(animatedSortedProjects);
}

function addFadeToProjects(projects) {
    return projects.map((project, index) => {
        const even = index % 2 === 0;
        project.fadeIn = even ? "fadeInRight" : "fadeInLeft";
        project.imageLeft = even;
        project.imageRight = !even;
        return project;
    });
}

function convertProjectsToOwnObjects(projects) {
    return projects.map(project => {
        return {
            name: project.name,
            description: project.description,
            imagePath: project.imagePath,
            fadeIn: project.fadeIn,
            imageLeft: project.imageLeft,
            imageRight: project.imageRight,
            links: project.links.map(link => {
                // Same issue with Handlebars for nested objects coming back from Sequelize.
                return {
                    name: link.name,
                    url: link.url
                };
            }),
            stack: project.stack.map(software => {
                // And again
                return {
                    name: software.name
                };
            }),
            order: project.order
        };
    });
}

function sortProjectsByOrder(projects) {
    return projects.sort((a, b) => a.order - b.order);
}

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
