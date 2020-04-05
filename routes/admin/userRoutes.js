const express = require("express");
const router = express.Router();
const auth = require("../../util/authentication");
const userController = require("../../controllers/userController");

router
    .route("/login")
    .get(userController.renderLogin)
    .post(auth.authenticate);

router.get("/loginRedirect", userController.loginRedirect);

module.exports = router;
