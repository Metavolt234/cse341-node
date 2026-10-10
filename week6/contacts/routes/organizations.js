const express=require('express');const c=require('../controllers/organizations');const {requireLogin}=require('../auth');const r=express.Router();
r.get('/',c.getAll);r.get('/:id',c.getSingle);r.post('/',requireLogin,c.create);r.put('/:id',requireLogin,c.update);r.delete('/:id',requireLogin,c.remove);module.exports=r;
