const socket = io();

socket.on("connect", function() {
    var startTemplate = jQuery("#start-template").html();
    var start = Mustache.render(startTemplate, {});
    jQuery("#main").html("").append(start);
});

socket.on("joinedRoom", function() {
    var template = jQuery("#lobby-template").html();
    var lobby = Mustache.render(template, {text: "Waiting for other Players"});
    jQuery("#main").html("").append(lobby);
});

socket.on("correctAnswer", function(score) {
    var template = jQuery("#question-template").html();
    var q = Mustache.render(template, {text: "Correct! - Your Score is " + score + " \n Waiting for other players to answer"});
    jQuery("#main").html("").append(q);
});

socket.on("incorrectAnswer", function(crc) {
    var template = jQuery("#question-template").html();
    var q = Mustache.render(template, {text: "Incorrect! The correct answer was " + crc.correct + " - Your Score is " + crc.score + " \n Waiting for other players to answer"});
    jQuery("#main").html("").append(q);
});

socket.on("newQuestion", function(question) {
    console.log(question);
    var template = jQuery("#question-template").html();
    var q = Mustache.render(template, {text: question.question});
    jQuery("#main").html("").append(q);

    for(var i = 0; i < question.options.length; i++) {
        var template = jQuery("#answers-template").html();
        var option = Mustache.render(template, {option: question.options[i]});
        jQuery("#question").append(option);
    };

});

//Error Handling 
socket.on("ERROR", function(error) {

    if(error.code === "NAMEERROR") {
        jQuery("#error").html(error.msg);
    };

});


// Client Functions

function joinRoom() {
    var room = jQuery("#roomName").val();
    var name = jQuery("#userName").val();
    console.log(`Room: ${room} Username: ${name}`);
    socket.emit("joinRoom", {room, name});
};

function sendAnswer(value) {
    socket.emit("submitAnswer", value.innerHTML);
}