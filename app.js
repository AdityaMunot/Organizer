const express = require("express");
const session = require('express-session')
const expHbs = require("express-handlebars");
const static = express.static(__dirname + "/public");
const bodyParser = require("body-parser");
const configRoutes = require("./routes");

const app = express();


app.use("/public", static)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(session({
    name: 'AuthCookie',
    secret: 'somesecretstring!',
    resave: false,
    saveUninitialized: false,
}))

app.engine("handlebars", expHbs({defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});