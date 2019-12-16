const users = require('./users.js');
const dbConnection = require("./../config/mongoConnection");

async function main() {
    const db = await dbConnection();

    const NewUser = await users.createUser("amunot","helloHi@951357", "amunot@stevens.edu", "Aditya", "Munot");
    console.log(NewUser)

    db.serverConfig.close();
}

main()