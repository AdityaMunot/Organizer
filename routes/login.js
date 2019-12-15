const express = require("express");
const router = express.Router();
const userData = require("../data/users");


router.post("/", async (req, res) => {
    
    var hasErrors = false;
    let errors = [];
    if (req.session.userID) {
        res.redirect("/home");
    }
    else {
        var userName = req.body.uname;
        var password = req.body.psw;
        try {
            if (await userData.loginUser(userName, password) == false) {
                displayMessage = "login"
                loginMessage = "Invalid Username/Password"
                res.status(401);
                res.render("details/login", { displayMessage: displayMessage, loginMessage: loginMessage });
            }
            else {
                let userFound = await userData.getByUserName(userName);
                req.session.userID = userFound._id;
                res.redirect("/home");
            }
        }
        catch (e) {
            console.log(e)
            auth = "Not Authorised User"
            displayMessage = "login"
            loginMessage = "Username/Password not provided or no user exist with such a username"
            res.status(401);
            res.render("details/login", { displayMessage: displayMessage, loginMessage: loginMessage });
        }
    }
});

router.get("/", async (req, res) => {
    if (req.session.userID) {
        try {
            userId = req.session.userID;
            let user = await userData.getUserById(userId);
            res.redirect("/home");
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        try {
            res.render("details/login")
        } catch (e) {
            res.status(404).json({ error: e })
        }
    }
});



module.exports = router;
