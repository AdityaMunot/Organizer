// const data = require('./index');
const accounts = require("./finance")
const dbConnection = require("./../config/mongoConnection");

async function main() {
    const db = await dbConnection();

    // const NewUser = await users.createUser("amunot","helloHi@951357", "amunot@stevens.edu", "Aditya", "Munot");
    // console.log(NewUser)

    const allTrans = await accounts.getAllTransactionByBankAccount("1234");
    console.log(allTrans)

    db.serverConfig.close();
}

main()