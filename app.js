require('dotenv').config()  ; 
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const path = require('path');


require('mongoose').connect(process.env.URI).then(() => console.log('running'))



app.use(express.json()) ; 
app.use(express.urlencoded({extended: false})); 
app.use(cookieParser())

app.use('/api',require('./routes/api'))  

module.exports = app  ; 