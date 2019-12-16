const express = require("express");
const router = express.Router();
const uData = require("../data/users");

router.post("/", async (req, res) => {
    var data = {}
    let displayMessage = false
    data.firstName = req.body.firstName;
    data.lastName = req.body.lastName;
    data.password = req.body.password
    data.email = req.body.email;
    data.userName = req.body.username;
    try {
        const userCreated = uData.createUser(data.userName, data.password, data.email, data.firstName, data.lastName);
        displayMessage = "signup"
        Message = "User is created successfully"
        res.render("details/login", { signupMessage: Message, displayMessage: displayMessage })
    } catch (e) {
        displayMessage = "signup"
        Message = "User is not created "
        res.render("details/login", { signupMessage: Message, displayMessage: displayMessage })
    }
});

router.get("/", async (req, res) => {
    try {
        res.render("details/signup");
    } catch (e) {
        res.status(404).json({ error: e})
    }
});

module.exports = router;
