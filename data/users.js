const mongoCollections = require("../config/mongoCollections");
var mongodb = require('mongodb');
const users = mongoCollections.users;

const createUser = async function createUser(uName, pwd, emailId, firstName, lastName) {
    
    if(!uName) throw "for createUser() you must provide username"
    if(!pwd) throw "for createUser() you must provide a password"
    if(!emailId) throw "for createUser() you must provide an email-id"
    if(!firstName) throw "for createUser() you must provide first name"
    if(!lastName) throw "for createUser() you must provide last name"

    if(typeof uName != "string") throw "for create() username must be a string"
    if(typeof pwd!= "string") throw "for create() password must be string"
    if(typeof emailId!= "string") throw "for create() email-id must be a string"
    if(typeof firstName != "string") throw "for create() first name isn't a string"
    if(typeof lastName != "string") throw "for create() last name isn't a string"

    const salts = 16

    let newUser = {}

    if(regExEmailID.test(emailId)){
        acceptedEmailID = emailId.toLowerCase()
    }
    else{
        throw "email Id does not match specifications\n"+
        "email must be comparable to 'user@example.com'"
    }

    if(regExPwd.test(pwd)){
        validPwd=pwd
    }
    else{
        throw "password doesnt satisfy all conditions\n"+
        "password between 8 to 15 characters which contain\n"+
        "at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
    }

    if(_users.length > 0){
        unameAlreadyExists = await _users.findOne({uName : uName})
    }

    if(unameAlreadyExists !== undefined ){
        throw "Username is already taken, try another"
    }

    if(regExUname.test(uName)){
        acceptedUName = uName
    }
    else{
        throw"username does not match specifications\n"+
        "username must be 3 to 15 charecters\n"+
        "can contain letters numbers and '_'"
    }

    let hashedPwd = await bcrypt.hash(validPwd,salts)

    newUser={
        firstName:firstName.toLowerCase(),
        lastName:lastName.toLowerCase(),
        emailID:acceptedEmailID,
        uName:acceptedUName.toLowerCase(),
        pwd:hashedPwd,
        posts:[],
        comments:[],
        score:score,
        avatar:avatar,
        superpowers:superpowers
    }

    const inserted = await _users.insertOne(newUser)

    if(inserted.insertedCount === 0) throw "there was a problem in create() this user could not be added"

    const userAdded = await get(ObjectId(inserted.insertedId).toString())
    return userAdded
}

module.exports = {
    createUser,
}