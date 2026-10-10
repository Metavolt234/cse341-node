const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const required = ['projectId', 'volunteerName', 'volunteerEmail', 'registrationDate', 'status'];
const statuses = ['registered','confirmed','cancelled','completed'];
function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be a JSON object.';
  const missing = required.filter(k => body[k] == null || String(body[k]).trim() === '');
  if (missing.length) return `Required fields missing: ${missing.join(', ')}.`;
  if (!ObjectId.isValid(String(body.projectId))) return 'projectId must be a valid MongoDB ObjectId.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.volunteerEmail).trim())) return 'Provide a valid volunteerEmail.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(body.registrationDate)) || Number.isNaN(new Date(body.registrationDate).getTime())) return 'registrationDate must use YYYY-MM-DD format.';
  if (!statuses.includes(String(body.status).toLowerCase().trim())) return `status must be one of: ${statuses.join(', ')}.`;
  if (String(body.volunteerName).trim().length < 2) return 'volunteerName must be at least 2 characters.';
  return null;
}
function clean(b){return {projectId:String(b.projectId).trim(),volunteerName:String(b.volunteerName).trim(),volunteerEmail:String(b.volunteerEmail).trim().toLowerCase(),registrationDate:String(b.registrationDate).trim(),status:String(b.status).trim().toLowerCase()};}
async function getAll(req,res){try{return res.status(200).json(await getDb().collection('registrations').find().sort({registrationDate:-1}).toArray());}catch(e){return res.status(500).json({message:'Failed to retrieve registrations.'});}}
async function getSingle(req,res){try{if(!ObjectId.isValid(req.params.id))return res.status(400).json({message:'Invalid registration id.'});const x=await getDb().collection('registrations').findOne({_id:new ObjectId(req.params.id)});if(!x)return res.status(404).json({message:'Registration not found.'});return res.status(200).json(x);}catch(e){return res.status(500).json({message:'Failed to retrieve registration.'});}}
async function create(req,res){try{const error=validate(req.body);if(error)return res.status(400).json({message:error});const item=clean(req.body);const r=await getDb().collection('registrations').insertOne(item);return res.status(201).json({message:'Registration created.',id:r.insertedId,registration:item});}catch(e){return res.status(500).json({message:'Failed to create registration.'});}}
async function update(req,res){try{if(!ObjectId.isValid(req.params.id))return res.status(400).json({message:'Invalid registration id.'});const error=validate(req.body);if(error)return res.status(400).json({message:error});const r=await getDb().collection('registrations').replaceOne({_id:new ObjectId(req.params.id)},clean(req.body));if(!r.matchedCount)return res.status(404).json({message:'Registration not found.'});return res.status(200).json({message:'Registration updated.'});}catch(e){return res.status(500).json({message:'Failed to update registration.'});}}
async function remove(req,res){try{if(!ObjectId.isValid(req.params.id))return res.status(400).json({message:'Invalid registration id.'});const r=await getDb().collection('registrations').deleteOne({_id:new ObjectId(req.params.id)});if(!r.deletedCount)return res.status(404).json({message:'Registration not found.'});return res.status(200).json({message:'Registration deleted.'});}catch(e){return res.status(500).json({message:'Failed to delete registration.'});}}
module.exports={getAll,getSingle,create,update,remove};
