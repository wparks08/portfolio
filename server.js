require("dotenv").config();
var express = require("express");
var exphbrs = require("express-handlebars");
var db = require("./models");

// Setup app
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Initialize handlebars
var hbrsOptions = {
    defaultLayout: "main"
};

app.engine("handlebars", exphbrs(hbrsOptions));
app.set("view engine", "handlebars");

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
