require('dotenv').config()


const express = require('express');
const user = require('../model/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const { signUserIn , logUserOut , verifyLogin, logfromAllDevices, RefreshAccessToken } = require('../util/function');
const refreshtoken = require('../model/refreshtoken');




router.post('/signup',async(req,res)=>{
    const {name , password} = req.body ; 
    const hashed_password  = await bcrypt.hash(password ,10) ; 
    try { 
        const userr = new user({"name": name , "password" : hashed_password}) 
        userr.save() ; 
        return res.status(201).json(userr) ; 
    }
    catch(e) {
        res.sendStatus(401).json({error : e.name})  ;
        
    }


})
router.post('/login',signUserIn , (req,res)=>{
    res.status(200).send('jawek behi')
})


router.get('/users',(req,res)=> {
 user.find().then((list) => res.send(list))
})


router.get('/tokens',(req,res)=> {
    refreshtoken.find().then((list) => res.send(list))
   })


   router.get('/protected',verifyLogin ,  (payload , req, res, next )=>{
    res.send('Protected ')
       
   })
router.delete('/signout', logUserOut,  (req, res, next)=>{
    
})
router.delete('/logalldevicesout', logfromAllDevices,  (req, res, next)=>{
    
})

router.post('/refreshtoken', RefreshAccessToken) ;

router.get('/me',verifyLogin , async (payload , req, res, next )=>{
   
    const userr = await user.findById(payload.id) ; 
    res.json({name : userr.name , dateJoined : userr.date_joined.toLocaleDateString()}) ; 
       
   })

module.exports = router;