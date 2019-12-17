const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const posts = data.posts;

async function main() {
  const db = await dbConnection();

  await db.dropDatabase();

  const ruthy = await users.createUser('ruthylevi', 'iLoveCorgis97!', 'rlevi@stevens.edu', 'Ruthy', 'Levi');
  const id = ruthy._id;

  await posts.addPost(
    'Using the seed',
    'We use the seed to have some initial data so we can just focus on servers this week',
  );

  console.log('Done seeding database');
  await db.serverConfig.close();
}

main().catch((error) => {
  console.error(error);
  return dbConnection().then((db) => {
    return db.serverConfig.close();
  });
});
