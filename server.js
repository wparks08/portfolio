require("dotenv").config();
const express = require("express");
const exphbrs = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const authentication = require("./controllers/authentication");

const db = require("./models");

// Setup app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }
    })
);

// Passport config
authentication.config(passport);

// Initialize handlebars
const hbrsOptions = {
    defaultLayout: "main",
    allowProtoPropertiesByDefault: true
};

app.engine("handlebars", exphbrs(hbrsOptions));
app.set("view engine", "handlebars");

// Add routes
require("./routes/adminRoutes")(app);
require("./routes/htmlRoutes")(app);

// Set sequelize options
const syncOptions = {
    force: false
};

// Sync models and start server
db.sequelize.sync(syncOptions).then(() => {
    app.listen(PORT, () => {
        console.log("Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});
