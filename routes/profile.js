const express = require("express");
const router = express.Router();
const uData = require("../data/users");

router.get("/", async (req, res) => {
    var accounts = [];
    userId = req.session.userID;
    let userFound = await uData.getUserById(userId);
    for (i=0; i<userFound.accounts.length; i++){
        accounts.push(userFound.accounts[i]);
    }
    console.log(accounts)
    res.render('details/profile', { userFound , accounts });
})

router.post("/userdelete", async (req, res) => {
    userId = req.session.userID;
    try {
        let userDelete = await uData.removeUser(userId);
        if (userDelete) {
            req.session.destroy(function (err) {
                // cannot access session here
            })
            displayMessage = "profileDelete"
            profileMessage = "Profile Successfully delete"
            res.render("details/login", { displayMessage: displayMessage, profileMessage: profileMessage });
        }
    } catch (e) {
        console.log(e);
        displayMessage = "profileDelete"
        profileMessage = "Profile delete unsuccessful"
        res.status(401);
        res.render("details/login", { displayMessage: displayMessage, profileMessage: profileMessage });
    }
})

router.post("/changepassword", async (req, res) => {
    userId = req.session.userID;
    oldPassword = req.body.oldPassword
    newPassword = req.body.newPassword
    try {
        let PasswordChange = await uData.passwordChange(userId, oldPassword, newPassword);
        if (PasswordChange) {
            req.session.destroy(function (err) {
                // cannot access session here
            })
            displayMessage = "changePassword"
            changePasswordMessage = "Password change successful"
            res.render("details/login", { displayMessage: displayMessage, profileMessage: changePasswordMessage});
        }
        else {
            req.session.destroy(function (err) {
                // cannot access session here
            })
            displayMessage = "changePassword"
            changePasswordMessage = "Password change failed. Please enter your current password correctly."
            res.render("details/login", { displayMessage: displayMessage, profileMessage: changePasswordMessage});
        }
    } catch (e) {
        console.log(e);
        req.session.destroy(function (err) {
            // cannot access session here
        })
        displayMessage = "changePassword"
        changePasswordMessage = "Password change failed"
        res.status(401);
        res.render("details/login", { displayMessage: displayMessage, profileMessage: changePasswordMessage});
    }
})

module.exports = router;