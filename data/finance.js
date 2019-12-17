const bcrypt = require("bcryptjs")
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const accounts = mongoCollections.accounts;
const ObjectId = require('mongodb').ObjectID;
const data = require("./index")

const getAllTransactionByBankAccount = async function getAllTransactionByAccountNo(AccountNo) {

    if(!AccountNo) throw "for getAllTransactionByBankAccount(id) you must provide an id";
    if (typeof AccountNo !== "string") throw "for getAllTransactionByBankAccount(id) id must be a string";
    
    const _account = await accounts();
    const allTransaction = await _account.find({ accountNo: AccountNo }).toArray()

    if (allTransaction === null || allTransaction === undefined) throw "for getAllTransactionByBankAccount(id) there is no such Transaction with that account no in the collection"
    
    return allTransaction

}

module.exports = {
    getAllTransactionByBankAccount,
}