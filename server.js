require("dotenv").config();
const express = require("express");
const exphbrs = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const authentication = require("./controllers/authentication");
const config = require("./config/config");
const db = require("./models");

// Setup app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded(config.urlencoded.options));
app.use(express.json());
app.use(express.static(config.static.folder));
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload(config.fileUpload.options));

// Passport config
authentication.config(passport);

// Initialize view engine
app.engine(config.viewEngine.name, exphbrs(config.viewEngine.options));
app.set("view engine", config.viewEngine.name);

// Add routes
require("./routes/adminRoutes")(app);
require("./routes/htmlRoutes")(app);

// Sync models and start server
db.sequelize.sync(config.sequelize.sync).then(() => {
    app.listen(PORT, () => {
        console.log("Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});
