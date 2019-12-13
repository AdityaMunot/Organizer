const express = require("express");
// const bodyParser = require("body-parser");
const configRoutes = require("./routes");
const expHbs = require("express-handlebars");
const static = express.static(__dirname + "/public");

const app = express();
// app.use(bodyParser.urlencoded());

app.use("/public", static)
app.engine("handlebars", expHbs({defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});