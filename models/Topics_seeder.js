var mongoose = require("mongoose");
mongoose.connect('localhost:27017/tzair');
var Topic = require("./Topic.js");

var Topics = [
    Topic({
    name: "Storage",
    questions: []
    }),
    Topic({
    name: "Vmware",
    questions: []      
    }),
    Topic({
    name: "Microsoft",
    questions: []
    }),
    Topic({
    name: "DB",
    questions: []  
    })
];
    
for (var i = 0; i < Topics.length; i++){
    Topics[i].save(function(err, result){
        if (i === Topics.length - 1)
        {
            mongoose.disconnect();
        }    
    });
}