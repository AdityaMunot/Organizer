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

const addTransaction = async function addTransaction(accountNo, amount, comment) {

    if (!accountNo) throw "for addTransaction() you must provide accountNo"
    if (!amount) throw "for addTransaction() you must provide a amount"
    if (!comment) throw "for addTransaction() you must provide an comment"

    if(typeof accountNo != "string") throw "for addTransaction() accountNo you must provide string"
    if(typeof amount != "string") throw "for addTransaction() amount you must provide number"
    if(typeof comment != "string") throw "for addTransaction() comment you must provide string"

    // let dec =  Decimal128.fromString(amount)
    let newTransaction = {
        accountNo: accountNo,
        amount: amount,
        comment: comment,
    }

    const _accounts = await accounts()

    const inserted = await _accounts.insertOne(newTransaction)

    if (inserted.insertedCount === 0) throw "there was a problem in addTransaction() this user could not be added"

    const transactionAdded = await getTransactionById(ObjectId(inserted.insertedId).toString())
    return transactionAdded
}

const deleteTransactionById = async function deleteTransactionById(id){
    if(!id) throw "for deleteTransactionById(id) you must provide an id"
    if(typeof id !== "string") throw "for deleteTransactionById(id) id must be a string"
    if(!ObjectId.isValid(id)) throw "for deleteTransactionById() object id is not of proper type"

    removedTransaction = await getTransactionById(id);
    const _accounts = await accounts();
    const removed = await _accounts.deleteOne({_id: ObjectId(id)})

    if(removed.deletedCount === 0) throw "there was a problem in deleteTransactionById() this user could not be remmoved"

    return removedTransaction;
}

const getTransactionById = async function getTransactionById(id){
    if (!id) throw "for getTransactionById(id) you must provide an id"
    if (typeof id !== "string") throw "for getTransactionById(id) id must be a string"
    if (!ObjectId.isValid(id)) throw "for getTransactionById() object id is not of proper type"

    const _accounts = await accounts();
    const transactionFoundbyID = await _accounts.findOne({ _id: ObjectId(id) })

    if (transactionFoundbyID === null || transactionFoundbyID === undefined) throw "for getTransactionById(id) there is no such user with that id in the collection"

    return transactionFoundbyID


}

module.exports = {
    getAllTransactionByBankAccount,
    addTransaction,
    deleteTransactionById,
    getTransactionById
}