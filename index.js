const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
const routes = require('./routes/routes');

const mongoString = process.env.DATABASE_URL
const app = express();
app.use(express.json());
app.use(cors());

app.listen(4007,() =>{
    console.log(`server started ${4007}`);
}) 

mongoose.connect(mongoString);
const result = mongoose.connection

result.once('error',(error) =>{
    console.log(error);
    
})

result.on('connected',() =>{
    console.log('database connected');
    
})

app.use('/api', routes)