var db = require("../models");

module.exports = function(app) {
    app.get("/", (req, res) => {
        res.locals.pageTitle = "Will Parks | Portfolio";

        getAllProjects()
            .then(projects => {
                addFadeToProjects(projects);
                // Need to map projects to a new object, due to new Handlebars restrictions (>4.6.0)
                // https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access
                const allProjects = projects.map(project => {
                    return {
                        name: project.name,
                        description: project.description,
                        imagePath: project.imagePath,
                        fadeIn: project.fadeIn,
                        imageLeft: project.imageLeft,
                        imageRight: project.imageRight,
                        links: project.links.map(link => {
                            return {
                                name: link.name,
                                url: link.url
                            };
                        }),
                        stack: project.stack.map(software => {
                            return {
                                name: software.name
                            }
                        })
                    };
                });
                res.render("index", {
                    projects: allProjects
                });
            })
            .catch(err => {
                res.render("500", { err });
            });
    });
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

function addFadeToProjects(projects) {
    projects.forEach((project, index) => {
        if (index % 2 === 0 || index === 0) {
            project.fadeIn = "fadeInRight";
            project.imageLeft = true;
            project.imageRight = false;
        } else {
            project.fadeIn = "fadeInLeft";
            project.imageLeft = false;
            project.imageRight = true;
        }
    });
}
