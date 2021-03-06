const express = require("express");
const bodyParser = require("body-parser");
const shortId = require("shortid");
const router=express.Router();

const db = require("../db");
const transactions=db.get('transactions');
const users=db.get('users');
const books=db.get('books');
router.get('/create',(req,res)=>{
    res.render('trans/create',{users:users.value(),books:books.value()});
});

router.post('/create',(req,res)=>{
    var createTrans={};
    createTrans.id=shortId.generate();
    createTrans=req.body;
    createTrans.name=users.find({id:req.body.userid}).value().name;
    createTrans.title=books.find({id:req.body.bookid}).value().title;
    createTrans.iscomplete= 'false';
    transactions.push(createTrans).write();
    res.redirect('/trans');
    
});
router.get('/',(req,res)=>{
    var listTransaction=transactions.value().filter(user=> { 
        if(user.userid===req.cookies.id) return user;
    });
    console.log(listTransaction);
    res.render('trans/index',{trans:listTransaction});
})

router.get('/:id/complete',(req,res)=>{
    var id =req.params.id;
    var iscom=transactions.find({id:id}).value().iscomplete;
    console.log(iscom)
    if(iscom==='true')
        transactions.find({id:id}).assign({iscomplete:'false'}).write();
    else
        transactions.find({id:id}).assign({iscomplete:'true'}).write();
    res.redirect('/trans');
})

module.exports=router;