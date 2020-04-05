const express = require("express");
const router = express.Router();
const auth = require("../../util/authentication");
const projectController = require("../../controllers/projectController");

router.get("/projects", auth.secureRoute, projectController.getAdminProjects);

router
    .route("/projects/create")
    .all(auth.secureRoute)
    .get(projectController.renderCreateProject)
    .post(projectController.insert);

router.get("/projects/:id", auth.secureRoute, projectController.findOne);
router.post("/projects/:id/update", auth.secureRoute, projectController.update);
router.post("/projects/:id/addLink", auth.secureRoute, projectController.addLink);
router.post("/projects/:id/updateStack", auth.secureRoute, projectController.updateStack);

module.exports = router;
