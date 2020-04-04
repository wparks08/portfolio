const imageController = require("../controllers/imageController");
const projectController = require("../controllers/projectController");

module.exports = function(app) {
    app.get("/", projectController.getProjects);
    app.get("/image/:key", imageController.getImage);
};
