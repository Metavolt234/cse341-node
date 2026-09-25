const { getDb } = require('./connect');

async function upsertGithubUser(profile) {
  const db = getDb();
  const users = db.collection('users');

  const user = {
    githubId: profile.id,
    username: profile.username || '',
    displayName: profile.displayName || profile.username || 'GitHub User',
    email: profile.emails?.[0]?.value || '',
    profileUrl: profile.profileUrl || '',
    avatarUrl: profile.photos?.[0]?.value || '',
    updatedAt: new Date()
  };

  const result = await users.findOneAndUpdate(
    { githubId: profile.id },
    {
      $set: user,
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true, returnDocument: 'after' }
  );

  return result;
}

async function findUserById(id) {
  return getDb().collection('users').findOne({ _id: id });
}

module.exports = { upsertGithubUser, findUserById };
