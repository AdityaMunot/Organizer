const express = require("express");
const session = require('express-session');
const expHbs = require("express-handlebars");
const static = express.static(__dirname + "/public");
const bodyParser = require("body-parser");
const configRoutes = require("./routes");
const cookieParser = require('cookie-parser');

const app = express();


app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(session({
    name: 'AuthCookie',
    secret: 'somesecretstring!',
    resave: false,
    saveUninitialized: false,
}))

app.use('*',(req,res, next)=>{
    console.log("[%s]: %s %s (%s)",
       new Date().toUTCString(),
       req.method,
       req.originalUrl,
       `${req.session.userID ? "" : "Non-"}Authenticated User`
       );
    next()
})

app.use(function(req, res, next) {
    app.locals.expreq = req;
    next();
})

app.engine("handlebars", expHbs({defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});