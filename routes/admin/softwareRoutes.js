const express = require("express");
const router = express.Router();
const auth = require("../../util/authentication");
const softwareController = require("../../controllers/softwareController");

router
    .route("/software")
    .all(auth.secureRoute)
    .get(softwareController.findAll)
    .post(softwareController.insert);

module.exports = router;
