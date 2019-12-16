const express = require("express");
const router = express.Router();



router.get("/", async (req, res) => {
    
    req.session.destroy(function(err) {
      // cannot access session here
    })
    displayMessage = "logout"
    logoutMessage = "You have been logged out!"
    res.render("details/login",{displayMessage:displayMessage,logoutMessage:logoutMessage});
  })

  module.exports=router