const express = require("express");
const router = express.Router();
const auth = require("../../util/authentication");

router.get("/home", auth.secureRoute, (req, res) => {
    res.render("home", { layout: "admin" });
});

module.exports = router;
