const bcrypt = require("bcryptjs")
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectID;

const createUser = async function createUser(uName, pwd, emailId, firstName, lastName) {

    if (!uName) throw "for createUser() you must provide username"
    if (!pwd) throw "for createUser() you must provide a password"
    if (!emailId) throw "for createUser() you must provide an email-id"
    if (!firstName) throw "for createUser() you must provide first name"
    if (!lastName) throw "for createUser() you must provide last name"

    if (typeof uName != "string") throw "for createUser() username must be a string"
    if (typeof pwd != "string") throw "for createUser() password must be string"
    if (typeof emailId != "string") throw "for createUser() email-id must be a string"
    if (typeof firstName != "string") throw "for createUser() first name isn't a string"
    if (typeof lastName != "string") throw "for createUser() last name isn't a string"

    const salts = 16

    let newUser = {}

    const _users = await users()

    let unameAlreadyExists
    let regExPwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    let regExUname = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    let regExEmailID = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    validPwd = ""
    acceptedUName = ""
    acceptedEmailID = ""

    if (regExEmailID.test(emailId)) {
        acceptedEmailID = emailId.toLowerCase()
    }
    else {
        throw "email Id does not match specifications\n" +
        "email must be comparable to 'user@example.com'"
    }

    if (regExPwd.test(pwd)) {
        validPwd = pwd
    }
    else {
        throw "password doesnt satisfy all conditions\n" +
        "password between 8 to 15 characters which contain\n" +
        "at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
    }

    // if (_users.length > 0) {
        unameAlreadyExists = await _users.findOne({ uName: uName })
    // }

    if (unameAlreadyExists !== null) {
        throw "Username is already taken, try another"
    }

    if (regExUname.test(uName)) {
        acceptedUName = uName
    }
    else {
        throw "username does not match specifications\n" +
        "username must be 3 to 15 charecters\n" +
        "can contain letters numbers and '_'"
    }

    let hashedPwd = await bcrypt.hash(validPwd, salts)

    newUser = {
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        emailID: acceptedEmailID,
        uName: acceptedUName.toLowerCase(),
        pwd: hashedPwd,
        accounts: []
    }

    const inserted = await _users.insertOne(newUser)

    if (inserted.insertedCount === 0) throw "there was a problem in create() this user could not be added"

    const userAdded = await getUserById(ObjectId(inserted.insertedId).toString())
    return userAdded
}

const removeUser = async function removeUser(id) {
    if(!id) throw "for remove(id) you must provide an id"
    if(typeof id !== "string") throw "for remove(id) id must be a string"
    if(!ObjectId.isValid(id)) throw "for remove() object id is not of proper type"

    removedUser = await getUserById(id)
    const _user = await users()
    const removed = await _user.deleteOne({ _id: ObjectId(id) })

   
    if(removed.deletedCount === 0) throw "there was a problem in remove() this user could not be remmoved"

    return removedUser
}

const getUserById = async function getUserById(id) {
    if (!id) throw "for get(id) you must provide an id"
    if (typeof id !== "string") throw "for get(id) id must be a string"
    if (!ObjectId.isValid(id)) throw "for get() object id is not of proper type"

    const _user = await users();
    const userFoundbyID = await _user.findOne({ _id: ObjectId(id) })

    if (userFoundbyID === null || userFoundbyID === undefined) throw "for get(id) there is no such user with that id in the collection"

    return userFoundbyID
}

const loginUser = async function loginUser(uName, pwd) {
    if(!uName) throw "for login() you must provide a username"
    if(!pwd) throw "for login() you must provide a password"

    if(typeof uName !== "string") throw "for login() username must be a string"
    if(typeof pwd !== "string") throw "for login password must be a strinng"

    const _users = await users()

    unameFound = await _users.findOne({uName : uName})

    if(unameFound === undefined || unameFound === null){
        throw "no such username"
    }
    else{
        let comparePWD = await bcrypt.compare(pwd, unameFound.pwd)
        if(comparePWD){
            return true
        }
        else{
            return false
        }
    } 
}

const getByUserName = async function getByUserName(username)
{
    if(!username) throw "for get(username) you must provide an username"

    const _user= await users()
    const userFoundbyUserName = await _user.findOne({uName:username})

    if(userFoundbyUserName === null || userFoundbyUserName === undefined) throw "for get(username) there is no such user with that username in the collection"

    return userFoundbyUserName
}

const passwordChange = async function passwordChange(id, oldPassword, newPassword) {

    if (!id) throw "for passwordChange() you must provide id"
    if (!oldPassword) throw "for passwordChange() you must provide a old password"
    if (!newPassword) throw "for passwordChange() you must provide a new password"

    if (typeof id != "string") throw "for passwordChange() username must be a string"
    if (typeof oldPassword != "string") throw "for passwordChange() old password must be string"
    if (typeof newPassword != "string") throw "for passwordChange() new password must be string"

    const salts = 16
    let regExPwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    validPwd = ""
    if (regExPwd.test(newPassword)) {
        validPwd = newPassword
    }
    else {
        throw "password doesnt satisfy all conditions\n" +
        "password between 8 to 15 characters which contain\n" +
        "at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
    }
    let hashedPwd = await bcrypt.hash(validPwd, salts)
    updatedPasswordInfo = {
        pwd: hashedPwd,
    }

    const _users = await users();

    userFound = await _users.findOne({_id: ObjectId(id) })
    
    if (userFound === null || userFound === undefined) {
        throw "for get(id) there is no such user with that id in the collection"
    }
    else {
        let comparePWD = await bcrypt.compare(oldPassword, userFound.pwd)
        if(comparePWD){
            const updateInfo = await _users.updateOne({_id: ObjectId(id)}, { $set: updatedPasswordInfo})
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
            return true
        }
        else{
            return false
        }
    }
}

let exportedMethods = {

        // async addUser(uName, pwd, emailId, firstName, lastName) {

        //     if (!uName) throw "for addUser() you must provide username"
        //     if (!pwd) throw "for addUser() you must provide a password"
        //     if (!emailId) throw "for addUser() you must provide an email-id"
        //     if (!firstName) throw "for addUser() you must provide first name"
        //     if (!lastName) throw "for addUser() you must provide last name"

        //     if (typeof uName != "string") throw "for create() username must be a string"
        //     if (typeof pwd != "string") throw "for create() password must be string"
        //     if (typeof emailId != "string") throw "for create() email-id must be a string"
        //     if (typeof firstName != "string") throw "for create() first name isn't a string"
        //     if (typeof lastName != "string") throw "for create() last name isn't a string"

        //     const salts = 16

        //     let newUser = {}

        //     const _users = await users()

        //     let unameAlreadyExists
        //     let regExPwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        //     let regExUname = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
        //     let regExEmailID = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        //     validPwd = ""
        //     acceptedUName = ""
        //     acceptedEmailID = ""

        //     if (regExEmailID.test(emailId)) {
        //         acceptedEmailID = emailId.toLowerCase()
        //     }
        //     else {
        //         throw "email Id does not match specifications\n" +
        //         "email must be comparable to 'user@example.com'"
        //     }

        //     if (regExPwd.test(pwd)) {
        //         validPwd = pwd
        //     }
        //     else {
        //         throw "password doesnt satisfy all conditions\n" +
        //         "password between 8 to 15 characters which contain\n" +
        //         "at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
        //     }

        //     if (_users.length > 0) {
        //         unameAlreadyExists = await _users.findOne({ uName: uName })
        //     }

        //     if (unameAlreadyExists !== undefined) {
        //         throw "Username is already taken, try another"
        //     }

        //     if (regExUname.test(uName)) {
        //         acceptedUName = uName
        //     }
        //     else {
        //         throw "username does not match specifications\n" +
        //         "username must be 3 to 15 charecters\n" +
        //         "can contain letters numbers and '_'"
        //     }

        //     let hashedPwd = await bcrypt.hash(validPwd, salts)

        //     newUser = {
        //         firstName: firstName.toLowerCase(),
        //         lastName: lastName.toLowerCase(),
        //         emailID: acceptedEmailID,
        //         uName: acceptedUName.toLowerCase(),
        //         pwd: hashedPwd,
        //         accounts: [],
        //         _id: uuid(),
        //         posts: []
        //     }

        //     const inserted = await _users.insertOne(newUser)

        //     if (inserted.insertedCount === 0) throw "there was a problem in create() this user could not be added"

        //     const userAdded = await get(ObjectId(inserted.insertedId).toString())
        //     return userAdded
        // },


        //NEW

        async getAllUsers() {
            const userCollection = await users();
            const userList = await userCollection.find({}).toArray();
            if (!userList) throw 'No users in system!';
            return userList;
        },

        // async getUserById(id) {
        //     const userCollection = await users();
        //     const user = await userCollection.findOne({ _id: id });
        //     if (!user) throw 'User not found';
        //     return user;
        // },
        // async removeUser(id) {
        //     const userCollection = await users();
        //     const deletionInfo = await userCollection.removeOne({ _id: id });
        //     if (deletionInfo.deletedCount === 0) {
        //         throw `Could not delete user with id of ${id}`;
        //     }
        //     return true;
        // },
        async updateUser(id, updatedUser) {
            const user = await this.getUserById(id);
            console.log(user);

            let userUpdateInfo = {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName
            };

            const userCollection = await users();
            const updateInfo = await userCollection.updateOne({ _id: id }, { $set: userUpdateInfo });
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

            return await this.getUserById(id);
        },
        async addPostToUser(userId, postId, postTitle) {
            let currentUser = await this.getUserById(userId);
            console.log(currentUser);

            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: userId },
                { $addToSet: { posts: { id: postId, title: postTitle } } }
            );

            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

            return await this.getUserById(userId);
        },
        async removePostFromUser(userId, postId) {
            let currentUser = await this.getUserById(userId);
            console.log(currentUser);

            const userCollection = await users();
            const updateInfo = await userCollection.updateOne({ _id: userId }, { $pull: { posts: { id: postId } } });
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

            return await this.getUserById(userId);
        }
    };

module.exports = {
    createUser,
    removeUser,
    getUserById,
    loginUser,
    getByUserName,
    passwordChange,
    exportedMethods
};
