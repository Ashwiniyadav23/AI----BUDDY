const mongoose = require('mongoose');

const Schemadata = new mongoose.Schema({
  book: {
    question: String,
    answers: [String],
    savedDate: String
  }
});

module.exports = mongoose.model('Model', Schemadata);
