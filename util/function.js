

const {sign , verify} = require('jsonwebtoken') ;
const bcrypt = require('bcrypt')  ; 
const user = require('../model/user');
const refreshtoken = require('../model/refreshtoken');



const signUserIn = async(req,res,next) => {
    const {name, password} = req.body  ; 
    

    try { 
        const curr_user = await user.findOne({name : name})
        if(!curr_user) { 
            
            throw new Error('User Not Found') ; 
        }
        if(await bcrypt.compare(password,curr_user.password) === false) {
            throw new Error('Password Is Wrong') ; 
        }
        const curr_refreshToken = await sign({id : curr_user._id},process.env.REFRESH_TOKEN_SECRET) ; 
        const curr_accessToken = await sign({id : curr_user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn : '120s'})  ; 
        await new refreshtoken({user_id : curr_user._id , token : curr_refreshToken}).save() ; 
        res.cookie('Refreshing',`Bearer ${curr_refreshToken}`,{maxAge : 36000000 , httpOnly : true}) ; 
        res.cookie('Accessing',`Bearer ${curr_accessToken}`,{maxAge : 3600000 , httpOnly : true }) ; 
        res.status(200).json({msg : 'U are now logged In '}) ;
    }
    catch(e) {
        res.status(403).json({error : "token Expired"})
    }
}



const verifyLogin = async(req,res,next) => {
    const token = req.cookies.Accessing ; 
    if (!token) {
       return res.send('U are Not logged In') ; 
    }
    else { 
        try {
        const payload = await verify(token.split(' ')[1],process.env.ACCESS_TOKEN_SECRET) ; 
        next(payload) } 
        catch (e) {
            res.clearCookie('Accessing') ; 
res.clearCookie('Refreshing') ;
            res.status(401).send(`${e.message}`)
        }
    }

}



const logUserOut = async(req,res,next) => {

  

try { 
    res.clearCookie('Accessing') ; 
    res.clearCookie('Refreshing') ;

await refreshtoken.deleteOne({token : req.cookie.Refreshing}) ; 
res.send('logout success')
}
catch(e) { 
     res.send('logout success')
}   
}



const logfromAllDevices = async(req,res,next) => {
    console.log(req.body)
    try { 
        console.log(req.cookies) ; 
        const payload = await verify(req.cookies.Accessing.split(' ')[1],process.env.ACCESS_TOKEN_SECRET)
    const userr = await user.findById(payload.id) ; 
    
    if (await bcrypt.compare(req.body.password,userr.password) === true) {
        await refreshtoken.deleteMany({user_id : payload.id}) ; 
        res.send('logout success') }
        else {
            throw new Error('Password Is wrong u cant logout from all devices')
        }
    }
        catch(e) { 
           // console.log(e)  ;
             res.send(`${e.message}`)
        } 

}


const RefreshAccessToken = async (req,res,next) => {

    const RefToken = req.cookies.Refreshing.split(' ')[1] ;


   
   

 
   

        try { 
            if(!RefToken) { 
                throw new Error('There is  no Token')
            } 
            console.log(RefToken) ;
            const db = await refreshtoken.findOne({token : RefToken}) ; 
            if(!db) {
                throw new Error('refresh token is not registered')
            }
            console.log(db)
            const payload = verify(RefToken,process.env.REFRESH_TOKEN_SECRET) ; 
            console.log(db.user_id === payload.id)
            
            if (db.user_id === payload.id) {
                const nAcess = await sign({id : payload.user_id},process.env.ACCESS_TOKEN_SECRET,{expiresIn : '120s'})  ; 
                res.cookie('Accessing',`Bearer ${nAcess}`)
             return   res.send(`Token Refreshed  = = = ${nAcess}`)
            }
            throw new Error('this token is not yours') ;
        }
        catch(e) {
            res.send({error : e.message})
        }
    }



module.exports = { signUserIn , RefreshAccessToken,  logUserOut , logfromAllDevices ,  verifyLogin}