var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Topic = require("./Topic.js");
var textSearch = require('mongoose-text-search');

var question_schema = Schema({
    syntax: {type: String, required: true},
    answer: {type: String, required: true},
    topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }]
});

question_schema.plugin(textSearch);
question_schema.index({syntax: 'text', answer: 'text'});
module.exports = mongoose.model('Question', question_schema);