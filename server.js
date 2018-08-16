var express = require('express');
var app = express();
var hbs = require('express3-handlebars');
var path = require('path');
var async = require("async");
var mongoose = require("mongoose");
var Question = require("./models/Question.js");
var Topic = require("./models/Topic.js");
var bodyParser = require('body-parser');

app.engine('handlebars', hbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('localhost:27017/tzair');

app.get('/', function (req,res){
  res.render('home');
});

app.get('/questions', function (req, res){
  Topic.find(function(err,topics){
    if (err) return console.error(err);
    res.render('questions',{"topics": topics});
  });
});

app.get('/topics', function (req, res){
  Topic.find(function (err,topics) {
      if (err) return console.error(err);
      res.json(topics);
  });
});

app.post('/search', function (req, res){
  // Getting the details from the client request
  var search_text = req.body.search_text;
  
  // Running on all topics first to convert the names to id's
  Topic.find({name: {"$in": req.body.dropdown_topics_clicked}}).select('_id').exec(function (err, topics){
    if (err) return console.error(err);
    
    var topics_for_search = topics;
    
    // Fetching all questions, and condition with the the text and the topics.
    Question.find().and([
      { $or: [ {'syntax': { $regex: search_text}}, {'answer': { $regex: search_text}}] },
      { topics: {"$in": topics_for_search} }
      ])
    .exec(function (err, questions){
      if (err) return console.error(err);
      res.json(questions);
    });
  });
});

app.post('/deleteque', function (req, res){
  Question.remove({ _id: req.body.queid }, function(err,success_msg) {
      if (err) return console.error(err);
  });
});

app.post('/addtopic', function (req, res){
  // Getting the details ready for db
  var topic_to_save = new Topic(req.body.topic_details);
  
  // Save to DB
  topic_to_save.save(function(err, saved_topic){
    if (err) return console.error(err);
  });
});

app.post('/addque', function (req, res){
  // Getting the details from the client request
  var question_details = req.body.question_details;
  
  // Getting the id's of the topics
  Topic.find({name: {"$in": question_details.topics}}).select('_id').exec(function (err, topics){
    if (err) return console.error(err);
    
    // Apply the id's to the question_details variable
    question_details.topics = topics;
    
    // Generate new questions object
    var question_to_save = new Question(question_details);
    
    // Save to DB
    question_to_save.save(function(err, saved_question) {
      if (err) return console.error(err);
      
      // Update the relevant topics with the new question id
      async.each(question_details.topics, function(topic_id){
          Topic.update({ _id: topic_id }, { $push: { questions: saved_question._id }}, function (err, mongo_answer){
            if (err) return console.error(err);
            console.log(mongo_answer);
          });
        },
        function(err){
          if (err) return console.error(err);
        }
      );
    });
  });
});

app.post('/ask', function (req, res){
  // Switch the array of topic names to id's
  Topic.find({name: {"$in": req.body.dropdown_topics_clicked}}).select('_id').exec(function (err, topics){
    if (err) return console.error(err);
    
    var topics_for_search = topics;
    
    Question.count({topics: {"$in":topics_for_search}}).exec(function(err,Qnumber){
      if (err) return console.error(err);
      
      // Get a random entry
      var random = Math.floor(Math.random() * Qnumber);

      // Again query all questions but only fetch one offset by random
      Question.findOne({topics: {"$in":topics_for_search}}).skip(random).exec(function (err, question) {
        if (err) return console.error(err);
        res.json(question);
      });
    });
  });
});

/* Figure out why there is no variable sometime...
app.post('/search_angularJS', function (req,res){
  console.log("AngularJS AJAX, Parameter: " + req.body.param.search_text);
  var search_text = req.body.param.search_text;
  Question.find({$text: {$search: search_text}}).exec(function (err, questions){
    res.json(questions);
  });
});*/

app.use('/client',express.static('client'));

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");
