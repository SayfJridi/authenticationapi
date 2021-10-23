
const mongoose = require('mongoose') ;

const refreshtoken_schema = mongoose.Schema({
    user_id : {
        type : String  , 
        required : true  , 
    } , 
    token : { 
        type : String , 
        unique : true , 
        required : true 

    } , 

    date : {
        type : Date , 
        default : new Date()
    }

})


module.exports = mongoose.model('RefreshToken', refreshtoken_schema)