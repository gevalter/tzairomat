var Question = require("./Question.js");
var mongoose = require("mongoose");
mongoose.connect('localhost:27017/tzair');

var Questions = [
    new Question({
    syntax: "How much pil",
    answer: "3"
    }),
    new Question({
    syntax: "How much pil now",
    answer: "4"
    }),
    new Question({
    syntax: "and now",
    answer: "2"
    }),
    new Question({
    syntax: "How the fuck much pil",
    answer: "5"
    })
];

for (var i = 0; i < Questions.length; i++){
    Questions[i].save(function(err, result){
        if (i === Questions.length - 1)
        {
            mongoose.disconnect();
        }    
    });
}
