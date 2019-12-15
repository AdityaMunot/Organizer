const bcrypt = require("bcryptjs")
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectID;

let exportedMethods = {

    async addUser(uName, pwd, emailId, firstName, lastName) {

        if (!uName) throw "for addUser() you must provide username"
        if (!pwd) throw "for addUser() you must provide a password"
        if (!emailId) throw "for addUser() you must provide an email-id"
        if (!firstName) throw "for addUser() you must provide first name"
        if (!lastName) throw "for addUser() you must provide last name"

        if (typeof uName != "string") throw "for create() username must be a string"
        if (typeof pwd != "string") throw "for create() password must be string"
        if (typeof emailId != "string") throw "for create() email-id must be a string"
        if (typeof firstName != "string") throw "for create() first name isn't a string"
        if (typeof lastName != "string") throw "for create() last name isn't a string"

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

        if (_users.length > 0) {
            unameAlreadyExists = await _users.findOne({ uName: uName })
        }

        if (unameAlreadyExists !== undefined) {
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
            accounts: [],
            _id: uuid(),
            posts: []
        }

        const inserted = await _users.insertOne(newUser)

        if (inserted.insertedCount === 0) throw "there was a problem in create() this user could not be added"

        const userAdded = await get(ObjectId(inserted.insertedId).toString())
        return userAdded
    },


//NEW

    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        if (!userList) throw 'No users in system!';
        return userList;
    },

    async getUserById(id) {
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });
        if (!user) throw 'User not found';
        return user;
    },
    async removeUser(id) {
        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id}`;
        }
        return true;
    },
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

module.exports = exportedMethods;
