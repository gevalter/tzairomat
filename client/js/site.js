var TzairJS = angular.module('TzairJS', []);

// Setting the expression conflict between angular and handlebars
TzairJS.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{(');
  $interpolateProvider.endSymbol(')}');
});

// Setting the question page
TzairJS.controller("questions", function($scope,$http) {
  
  // Dropdown do not close after inside click
  $('.dropdown-menu').on("click.bs.dropdown", function (e) { e.stopPropagation(); e.preventDefault(); });
  
  // Topics query
  $http.get('/topics')
  .success(function(data){
      $scope.topics = data;
  })
  .error (function(data){
      console.log('Error: ' + data);
  });
  
  // Reset topic lists
  var topics_clicked = [];
  var dropdown_topics_clicked = [];
  
  // Dropdown - Select a topic
  $scope.dropdown_topic_click = function (index,topic) {
    // Resetting topics list on the event of all topics button is clicked
    if ($scope['dropdown_topic_all'] === "clicked")
    {
      dropdown_topics_clicked = [];
      $scope['dropdown_topic_all'] = null;
    }
     
    if ($scope['dropdown_topic_' + index] != "clicked")
    {
      $scope['dropdown_topic_' + index] = "clicked";
      dropdown_topics_clicked.push(topic.name);
    }
    else
    {
      $scope['dropdown_topic_' + index] = null;
      var topic_index = dropdown_topics_clicked.indexOf(topic.name);
      if (topic_index > -1) {
        dropdown_topics_clicked.splice(topic_index, 1);
      }
    }
  };
  
  // Dropdown - All topics button click
  $scope.dropdown_all_topics_click = function (){
    if ($scope['dropdown_topic_all'] != "clicked")
    {
      $scope['dropdown_topic_all'] = "clicked";
      dropdown_topics_clicked = $scope.topics.map(function(a) {return a.name;});
      for(var topics_loop = 0; topics_loop < $scope.topics.length; topics_loop++)
      {
        $scope['dropdown_topic_' + topics_loop] = null;
      }
    }
    else
    {
      $scope['dropdown_topic_all'] = null;
      dropdown_topics_clicked = [];
    }
  };
  
  
  // Open the delete modal - load the question vars for delete
  $scope.open_delete_modal = function (queid, queindex){
    $scope.question_delete_id = queid;
    $scope.question_delete_index = queindex;
  };
  
  // Delete question 
  $scope.delete_question = function (){
    
    // Setting variables for post
    var queid = $scope.question_delete_id;
    var queindex = $scope.question_delete_index;
    var url = '/deleteque';
    
    // Send the data using post
    var posting = $.post( url, { queid } );
    
    // Delete the date from page
    $scope.questions.splice(queindex, 1);
    
    // Put the results in a div
    posting.done(function( data ) {
      $scope.$apply(function (){
        console.log(data);
      });
    });
  };
  
  // Searching question with JQuery AJAX because angular AJAX is broken 
  $( "#searchForm" ).submit(function( event ) {
    // Stop form from submitting normally
    event.preventDefault();
    
    // Get some values from elements on the page:
    var $form = $( this ),
      term = $form.find( "input[name='search_text']" ).val(),
      url = $form.attr( "action" );
   
    // Send the data using post
    var posting = $.post( url, { search_text: term, dropdown_topics_clicked} );
   
    // Put the results in a div
    posting.done(function( data ) {
      $scope.$apply(function (){
        $scope.questions = data;
      });
    });
  });
});

// Setting the main page
TzairJS.controller("main", function($scope,$http) {
  
  // Dropdown do not close after inside click
  $('.dropdown-menu').on("click.bs.dropdown", function (e) { e.stopPropagation(); e.preventDefault(); });
  
  // asked question div is disappeared
  $scope['question_div'] = "panel-group disappeared";
  
  // Initialize the ngmodels that need validation - ngIf will not work on startup
  $scope.add_que_modal_syntax = "נוסח";
  $scope.add_que_modal_answer = "תשובה";
  $scope.add_topic_text = "שם נושא";
  
  // Topics query
  $http.get('/topics')
  .success(function(data){
      $scope.topics = data;
  })
  .error (function(data){
      console.log('Error: ' + data);
  });
  
  // Reset topic lists
  var topics_clicked = [];
  var dropdown_topics_clicked = [];
  
  // Select a topic from modal
  $scope.topic_click = function (index,topic) {
    if ($scope['topic_button_' + index] != "clicked")
    {
      $scope['topic_button_' + index] = "clicked";
      topics_clicked.push(topic.name);
    }
    else
    {
      $scope['topic_button_' + index] = null;
      var topic_index = topics_clicked.indexOf(topic.name);
      if (topic_index > -1) {
        topics_clicked.splice(topic_index, 1);
      }
    }
  };
  
  // Dropdown - Select a topic
  $scope.dropdown_topic_click = function (index,topic) {
    // Resetting topics list on the event of all topics button is clicked
    if ($scope['dropdown_topic_all'] === "clicked")
    {
      dropdown_topics_clicked = [];
      $scope['dropdown_topic_all'] = null;
    }
     
    if ($scope['dropdown_topic_' + index] != "clicked")
    {
      $scope['dropdown_topic_' + index] = "clicked";
      dropdown_topics_clicked.push(topic.name);
    }
    else
    {
      $scope['dropdown_topic_' + index] = null;
      var topic_index = dropdown_topics_clicked.indexOf(topic.name);
      if (topic_index > -1) {
        dropdown_topics_clicked.splice(topic_index, 1);
      }
    }
  };
  
  // Dropdown - All topics button click
  $scope.dropdown_all_topics_click = function (){
    if ($scope['dropdown_topic_all'] != "clicked")
    {
      $scope['dropdown_topic_all'] = "clicked";
      dropdown_topics_clicked = $scope.topics.map(function(a) {return a.name;});
      for(var topics_loop = 0; topics_loop < $scope.topics.length; topics_loop++)
      {
        $scope['dropdown_topic_' + topics_loop] = null;
      }
    }
    else
    {
      $scope['dropdown_topic_all'] = null;
      dropdown_topics_clicked = [];
    }
  };
  
  // Ask a question
  $scope.ask_question = function(){
    
    var ask_post = $.post("/ask", { dropdown_topics_clicked });
    
    // Put the results in a div
    ask_post.done(function( data ) {
      $scope.$apply(function (){
        $scope.asked_question = data;
        console.log($scope.asked_question);
      });
    });
    
    $scope['question_div'] = "panel-group";
  };

  // Save a topic to db
  $scope.save_topic = function(){
    // Check if there is a name for the topic
    if ($scope.add_topic_text.length > 0) 
    {
      // Init boolean for checking form errors - increasing every error 
      var addtopic_form_errors_counter = 0;
      
      // Case 1 - User didn't click any topics
      if ($scope.add_topic_text === "שם נושא")
      {
        addtopic_form_errors_counter++;
        var topic_name_error = angular.element("<div id='default_topic_name_error' class='add_que_modal_width alert alert-danger'><strong>אנא שנה שם נושא</strong></div>")
        var topic_error_div = document.getElementById('default_topic_name_div');
        
        // Find if this error is already exist in DOM
        try {
          angular.element(default_topic_name_error).length}
        catch(err){
          angular.element(topic_error_div).append(topic_name_error);
        }
      }
      
      // Check for error counter
      if (addtopic_form_errors_counter === 0)
      {
        var topic_details = {
          name: $scope.add_topic_text,
          questions: []
        };
        
        var topic_post = $.post("/addtopic", { topic_details });
        
        $('#addtopicbtnClose').click();
        
        // Send error / success message
        topic_post.done(function( data ) {
          alert(data);
        });
        
        // Reset the textbox
        $scope.add_topic_text = null;
      }
    }
  };
  
  // Save a question to db
  $scope.save_question = function(){
    
    // Build the question object for send
    var question_details = {
      syntax: $scope.add_que_modal_syntax,
      answer: $scope.add_que_modal_answer,
      topics: topics_clicked
      };
      
    // Init boolean for checking form errors - increasing every error 
    var form_errors_counter = 0;
    
    // Case 1 - User didn't click any topics
    if (question_details.topics.length === 0)
    {
      form_errors_counter++;
      var topics_error = angular.element("<div id='no_topics_error' class='add_que_modal_width alert alert-danger'><strong>אנא הכנס נושא</strong></div>")
      var error_div = document.getElementById('topics_error_div');
      
      //Find if this error is already exist in DOM
      try {
        angular.element(no_topics_error).length}
      catch(err){
        angular.element(error_div).append(topics_error);}
    }
    
    // Case 2 - User didn't changed syntax input in form
    if(question_details.syntax === "נוסח")
    {
      form_errors_counter++; 
      var syntax_error = angular.element("<div id='default_syntax_error' class='add_que_modal_width alert alert-danger'><strong>אנא שנה ניסוח שאלה</strong></div>")
      var error_div = document.getElementById('default_syntax_error_div');
      
      // Find if this error is already exist in DOM 
      try {
        angular.element(default_syntax_error).length}
      catch(err){
        angular.element(error_div).append(syntax_error);}
    }
    
    // Case 3 - User didn't changed answer input in form
    if (question_details.answer === "תשובה")
    {
      form_errors_counter++;
      var answer_error = angular.element("<div id='default_answer_error' class='add_que_modal_width alert alert-danger'><strong>אנא שנה תשובה</strong></div>")
      var error_div = document.getElementById('default_answer_error_div');
      
      // Find if this error is already exist in DOM 
      try {
        angular.element(default_answer_error).length}
      catch(err){
        angular.element(error_div).append(answer_error);}
    }
    
    // Checking error counter
    if (form_errors_counter === 0 && ($scope.add_que_modal_syntax != undefined) && $scope.add_que_modal_answer != undefined)
    {
      // Send the data using post
      var que_post = $.post("/addque", { question_details });
      
      // Send error / success message
      que_post.done(function( data ) {
        alert(data);
      });
      
      // Close the modal - by manually clicking the close button
      $('#addquebtnClose').click();
      
      // Reset question details
      $scope.add_que_modal_answer = null;
      $scope.add_que_modal_syntax = null;
      topics_clicked = null;
      
      // Reset topic buttons
      for(var topics_loop = 0; topics_loop < $scope.topics.length; topics_loop++)
      {
        $scope['topic_button_' + topics_loop] = null;
      }
    }
  };
});


