const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const financeData = require("../data/finance");

router.get("/", async (req, res) => {
    if (req.session.userID) {
        allTransaction = []
        try {
            userId = req.session.userID;
            let user = await userData.getUserById(userId);
            for (i = 0; i < user.accounts.length; i++) {
                var transaction = await financeData.getAllTransactionByBankAccount(user.accounts[i][0])
                for (j = 0; j < transaction.length; j++) {
                    allTransaction.push(transaction[j])
                }
            }
            res.render('details/finance', { allTransaction })
        } catch (e) {
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
})

module.exports = router;