require("dotenv").config();
var express = require("express");
var exphbrs = require("express-handlebars");
var session = require("express-session");
var passport = require("passport");
var authentication = require("./controllers/authentication");

var db = require("./models");

// Setup app
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
authentication.config(passport);

// Initialize handlebars
var hbrsOptions = {
    defaultLayout: "main",
    allowProtoPropertiesByDefault: true
};

app.engine("handlebars", exphbrs(hbrsOptions));
app.set("view engine", "handlebars");

// Add routes
require("./routes/adminRoutes")(app);
require("./routes/htmlRoutes")(app);

// Set sequelize options
var syncOptions = {
    force: false
};

// Sync models and start server
db.sequelize.sync(syncOptions).then(() => {
    app.listen(PORT, () => {
        console.log(
            "Listening on port %s. Visit http://localhost:%s/ in your browser.",
            PORT,
            PORT
        );
    });
});
