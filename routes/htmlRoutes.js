var db = require("../models");
var s3 = require("../controllers/awss3");

module.exports = function(app) {
    app.get("/", (req, res) => {
        res.locals.pageTitle = "Will Parks | Portfolio";

        getAllProjects()
            .then(projects => {
                // Need to map projects to a new object, due to new Handlebars restrictions (>4.6.0)
                // https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access
                const sortedProjects = sortProjectsByOrder(projects);
                const animatedSortedProjects = addFadeToProjects(sortedProjects);
                const allProjects = convertProjectsToOwnObjects(animatedSortedProjects);
                res.render("index", {
                    projects: allProjects
                });
            })
            .catch(err => {
                res.render("500", { err });
            });
    });

    app.get("/image/:key", (req, res) => {
        let key = req.params.key;
        s3.download(key)
            .then(image => {
                res.writeHead(200, { "Content-Type": image.ContentType });
                res.write(image.Body, "binary");
                res.end(null, "binary");
            })
            .catch(err => {
                console.log(err, err.stack);
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
    return projects.map((project, index) => {
        if (index % 2 === 0 || index === 0) {
            project.fadeIn = "fadeInRight";
            project.imageLeft = true;
            project.imageRight = false;
        } else {
            project.fadeIn = "fadeInLeft";
            project.imageLeft = false;
            project.imageRight = true;
        }
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
