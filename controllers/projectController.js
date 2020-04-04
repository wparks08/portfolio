const db = require("../models");

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
