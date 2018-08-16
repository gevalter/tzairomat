var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Question = require("./Question.js");

var topic_schema = Schema({  
    name: {type: String, required: true},
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question'}]
});

module.exports = mongoose.model('Topic', topic_schema);