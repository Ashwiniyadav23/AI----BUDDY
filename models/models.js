const mongoose = require('mongoose');

const Schemadata =  new mongoose.Schema({
    book:{
        type:String
    }
})
module.exports = mongoose.model('Model', Schemadata)