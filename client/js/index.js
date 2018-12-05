const socket = io();

var activeGame = false;
var storedCategories
/* var template = jQuery("#lobby-template").html();
var lobby = Mustache.render(template, {text: "Waiting for Players"});
jQuery("#main").append(lobby); */

// Socket IO Messages

socket.on("categories", function(categories) {
    storedCategories = categories;
    var startTemplate = jQuery("#start-template").html();
    var start = Mustache.render(startTemplate, {});
    jQuery("#main").html("").append(start);

    setCategories(categories);

});
socket.on("roomCreated", function() {
    var template = jQuery("#lobby-template").html();
    var lobby = Mustache.render(template, {text: "Waiting for Players",option: "Start Game!"});
    jQuery("#main").html("").append(lobby);
});

socket.on("correctAnswer", function(player) {
    // Update scores and display on screen during game
});

socket.on("incorrectAnswer", function(player) {
    // Update scores and display on screen during game
});

socket.on("gameFinished", function(players) {
    console.log(players);
    jQuery("#main").html("");
    var template = jQuery("#answers-template").html();
    var p = Mustache.render(template, {option: "Game Over - Scores: "});
    jQuery("#main").append(p);

    players.sort(function(a, b){
        return b.score > a.score;
      });

    players.forEach(function(player) {
        var template = jQuery("#answers-template").html();
        var p = Mustache.render(template, {option: `${player.name} scored ${player.score}`});
        jQuery("#main").append(p);
    });
    
});

socket.on("newQuestion", function(question) {
    console.log(question);
    activeGame = true;
    var template = jQuery("#question-template").html();
    var q = Mustache.render(template, {text: question.question});
    jQuery("#main").html("").append(q);

    for(var i = 0; i < question.options.length; i++) {
        var template = jQuery("#answers-template").html();
        var option = Mustache.render(template, {option: question.options[i]});
        jQuery("#question").append(option);
    }


});

socket.on("PLAYER-CONNECTED", function(p) {
    var template = jQuery("#player-template").html();
    var newPlayer = Mustache.render(template, {
        player: p.name
    });
    jQuery("#lobby").append(newPlayer);
});

socket.on("PLAYER-DISCONNECT", function(p) {

    if(activeGame) {
        console.log(p.name + "Disconnected!");
    } else {
        jQuery('*[id*=p]:visible').each(function() {
           if(jQuery(this).html() === p.name) {
               jQuery(this).detach();
           }
        });
  
    }

});

socket.on("ALL-DISCONNECT", function() {
    if(activeGame) {
        alert("All players left the game. Press okay to go back to menu.");
        activeGame = false;
        var startTemplate = jQuery("#start-template").html();
        var start = Mustache.render(startTemplate, {});
        jQuery("#main").html("").append(start);

        setCategories(storedCategories);
    }
});

//Error Handling 
socket.on("ERROR", function(error) {

    if(error.code === "ROOMERROR") {
        jQuery("#error").html(error.msg);
    } else if(error.code === "STARTERROR") {
        var template = jQuery("#error-template").html();
        var err = Mustache.render(template, {msg: error.msg});
        jQuery("#lobby").append(err);
    }

});


// Client Functions

function createRoom() {
    var room = jQuery("#roomName").val();
    var category = jQuery( "#categories option:selected" ).val();
    var difficulty = jQuery( "#difficulty option:selected" ).val();
    var questions = jQuery( "#number option:selected" ).val();
    console.log(room, category, difficulty, questions);
    socket.emit("createRoom", {room, category, difficulty, questions});

}

function startGame() {
    socket.emit("startGame");
};

function setCategories(categories) {
    var template = jQuery("#option-template").html();
    var option = Mustache.render(template, {
        val: 0,
        text: "Any Category"
    });
    jQuery("#categories").html("").append(option);

    categories.forEach(function (cat) {
        var template = jQuery("#option-template").html();
        var option = Mustache.render(template, {
            val: cat.id,
            text: cat.name
        });
        jQuery("#categories").append(option);
    });
};