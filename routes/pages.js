var express = require('express');
var User = require('../core/user');
var Data = require('../core/data');
var router = express.Router();
var user= new User();
var data= new Data();


router.get('/', (req, res, next) => {  
    res.render('login', {title:"Welcome to CTE Exercise"});
});

router.get('/register', (req, res, next) => {    
    
    res.render('register', {title:"Register"});
});



router.get('/data', (req, res, next) => {    
    const data = new Data();
    par=req.params
    data.read(par,function(result){
        res.render('data',{title:"Enter Health Data",data:result, message: 'Hello world!'});
    })

});


router.post('/register', (req, res, next) => {  
    const user= new User();
    let userInput = {
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };
    
    user.create(userInput, function(lastId) {
        if(lastId) {
            user.find(lastId, function(result){
                res.redirect('/data');
            });
          
        }else{
            console.log('error creatinmg the user')
        }
    }
)});


router.post('/data', (req, res, next) => {  
    const data= new Data();
    let dataInput = {
        systolic: req.body.systolic,
        diastolic: req.body.diastolic,
        hr: req.body.hr
    };
    
    data.create(dataInput, function(lastId) {
        if(lastId) {
            user.find(lastId, function(result){
                res.redirect('/data');
            });
          
        }else{
            console.log('error creating data: user not found');
                res.redirect('/data/'); // Comment: handle errors gracefully
        }
    }
)});

router.get('/index',(req,res,next)=> {
    const user= new User();
    user.index(user,function(result){
        if(user){
            
            res.render('index',{users:result});
        }else{
            console.log('error showing users')
        }
    })
    
})

/*
router.get('/delete/:id',(req,res,next)=> {
    const user= new User();
    
    par=req.params
    user.delete(par,function(result){
        res.redirect('/index');
    })
});
*/

/*
router.get('/edit/:id',(req,res,next)=> {
    const user= new User();
    
    par=req.params
    user.edit(par,function(result){
        
        res.render('edit',{title:"My application",user:result[0]});
    })

});
*/

/*
router.post('/update/:id',(req,res,next)=> {
    const user= new User();
    let reqs=req.params
    let userUpdate = {
        name: req.body.name,
        email: req.body.email,
        adress: req.body.adress,
        password: req.body.password,
        
    };
    console.log(userUpdate.name,req.params)
    
    user.update(userUpdate,reqs,function(result){
       
        res.redirect('/index');
    })

});
*/
module.exports = router;
