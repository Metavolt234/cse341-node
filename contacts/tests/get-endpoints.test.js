const test = require('node:test');
const assert = require('node:assert/strict');
const { ObjectId } = require('mongodb');
const { setDbForTests } = require('../db/connect');
const controllers = {
  contacts: require('../controllers/contacts'),
  projects: require('../controllers/projects'),
  organizations: require('../controllers/organizations'),
  registrations: require('../controllers/registrations')
};
const validId = new ObjectId();
function response() { return { statusCode: 200, body: undefined, status(code){this.statusCode=code;return this;}, json(value){this.body=value;return this;} }; }
function setCollection(name, {many=[], one={_id:validId, sample:true}}={}) {
  const collection = { find(){ return { sort(){return this;}, async toArray(){return many;} }; }, async findOne(){return one;} };
  setDbForTests({ collection(n){assert.equal(n,name);return collection;} });
}
for (const [name, c] of Object.entries(controllers)) {
  test(`${name} GET all returns 200 and an array`, async () => { const rows=[{_id:validId, name:'Sample'}]; setCollection(name,{many:rows}); const res=response(); await c.getAll({},res); assert.equal(res.statusCode,200); assert.deepEqual(res.body,rows); });
  test(`${name} GET one returns 200 for a valid id`, async () => { const row={_id:validId, name:'Sample'}; setCollection(name,{one:row}); const res=response(); await c.getSingle({params:{id:validId.toHexString()}},res); assert.equal(res.statusCode,200); assert.deepEqual(res.body,row); });
}
