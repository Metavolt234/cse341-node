const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const required = ['name', 'description', 'contactEmail', 'phone', 'address'];
function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be a JSON object.';
  const missing = required.filter((k) => body[k] == null || String(body[k]).trim() === '');
  if (missing.length) return `Required fields missing: ${missing.join(', ')}.`;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.contactEmail).trim())) return 'Provide a valid contactEmail.';
  if (String(body.name).trim().length < 2 || String(body.description).trim().length < 10) return 'Name must be at least 2 characters and description at least 10 characters.';
  return null;
}
function clean(b) { return Object.fromEntries(required.map(k => [k, String(b[k]).trim()])); }
async function getAll(req,res){ try { res.status(200).json(await getDb().collection('organizations').find().sort({name:1}).toArray()); } catch(e){res.status(500).json({message:'Failed to retrieve organizations.'});} }
async function getSingle(req,res){ try { if(!ObjectId.isValid(req.params.id)) return res.status(400).json({message:'Invalid organization id.'}); const item=await getDb().collection('organizations').findOne({_id:new ObjectId(req.params.id)}); if(!item)return res.status(404).json({message:'Organization not found.'}); return res.status(200).json(item); }catch(e){return res.status(500).json({message:'Failed to retrieve organization.'});} }
async function create(req,res){ try { const error=validate(req.body); if(error)return res.status(400).json({message:error}); const item=clean(req.body); const result=await getDb().collection('organizations').insertOne(item); return res.status(201).json({message:'Organization created.',id:result.insertedId,organization:item}); }catch(e){return res.status(500).json({message:'Failed to create organization.'});} }
async function update(req,res){ try { if(!ObjectId.isValid(req.params.id))return res.status(400).json({message:'Invalid organization id.'}); const error=validate(req.body); if(error)return res.status(400).json({message:error}); const result=await getDb().collection('organizations').replaceOne({_id:new ObjectId(req.params.id)},clean(req.body)); if(!result.matchedCount)return res.status(404).json({message:'Organization not found.'}); return res.status(200).json({message:'Organization updated.'}); }catch(e){return res.status(500).json({message:'Failed to update organization.'});} }
async function remove(req,res){ try {if(!ObjectId.isValid(req.params.id))return res.status(400).json({message:'Invalid organization id.'});const r=await getDb().collection('organizations').deleteOne({_id:new ObjectId(req.params.id)});if(!r.deletedCount)return res.status(404).json({message:'Organization not found.'});return res.status(200).json({message:'Organization deleted.'});}catch(e){return res.status(500).json({message:'Failed to delete organization.'});} }
module.exports={getAll,getSingle,create,update,remove};
