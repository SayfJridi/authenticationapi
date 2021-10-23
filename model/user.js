
const mongoose = require('mongoose') ;

const user_schema = mongoose.Schema({
    name : { 
        type : String ,
        required : true , 
    } , 
    password : { 
        type : String , 
        required : true  , 
    } ,
    date_joined : { 

        type : Date , 
        default : new Date()

    }

})


module.exports = mongoose.model('user', user_schema)