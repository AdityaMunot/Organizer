const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const financeData = require("../data/finance");

router.get("/", async (req, res) => {
    if (req.session.userID) {
        allTransaction = []
        transactions = []
        try {
            userId = req.session.userID;
            let user = await userData.getUserById(userId);
            for (i = 0; i < user.accounts.length; i++) {
                var transaction = await financeData.getAllTransactionByBankAccount(user.accounts[i][0])
                transactions.push(transaction)
                for (j = 0; j < transaction.length; j++) {
                    allTransaction.push(transaction[j])
                }
            }
            res.render('details/finance', { allTransaction, transactions })
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

router.post("/deleteTransaction", async (req, res) => {
    tid = req.body.transactionId;
    try {
        let transactionDelete = await financeData.deleteTransactionById(tid)
        if (transactionDelete) {
            displayMessage = "transactionDelete"
            transactionMessage = "Transaction Successfully delete"
            res.render("details/finance", { displayMessage: displayMessage, transactionMessage: transactionMessage });
        }
    } catch (e) {
        console.log(e);
        displayMessage = "transactionDelete"
        transactionMessage = "Transaction delete Unsuccessfully "
        res.status(401);
        res.render("details/finance", { displayMessage: displayMessage, transactionMessage: transactionMessage });
    }
})

router.post("/addTransaction", async (req, res) => {
    accountNo = req.body.accountNo;
    amount = req.body.amount;
    comment = req.body.comment;
    try{
        let newTransaction = await financeData.addTransaction(accountNo, amount, comment);
        if(newTransaction){
            displayMessage = "transactionAdd"
            transactionMessage = "Transaction Successfully Added"
            res.render("details/finance", { displayMessage: displayMessage, transactionMessage: transactionMessage });
        }
    }catch(e){
        console.log(e);
        displayMessage = "transactionAdd"
        transactionMessage = "Transaction Addition Unsuccessfully "
        res.status(401);
        res.render("details/finance", { displayMessage: displayMessage, transactionMessage: transactionMessage });
    }
})

module.exports = router;