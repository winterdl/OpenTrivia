const socket = io();

var activeGame = false;
/* var template = jQuery("#lobby-template").html();
var lobby = Mustache.render(template, {text: "Waiting for Players"});
jQuery("#main").append(lobby); */

// Socket IO Messages

socket.on("categories", function(categories) {
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

});
socket.on("roomCreated", function() {
    var template = jQuery("#lobby-template").html();
    var lobby = Mustache.render(template, {text: "Waiting for Players"});
    jQuery("#main").html("").append(lobby);
});

socket.on("newQuestion", function(question) {
    console.log(question);

});

socket.on("PLAYER-CONNECTED", function(p) {
    var template = jQuery("#player-template").html();
    var newPlayer = Mustache.render(template, {
        player: p.name
    });
    jQuery("#lobby").append(newPlayer);
});

socket.on("PLAYER-DISCONNECT", function(p) {
    console.log("recieved", p.name);

    if(activeGame) {

    } else {
        jQuery('*[id*=p]:visible').each(function() {
           if(jQuery(this).html() === p.name) {
               jQuery(this).detach();
           }
        });
  
    }

});

//Error Handling 
socket.on("ERROR", function(error) {

    if(error.code === "ROOMERROR") {
        jQuery("#error").html(error.msg);
    };

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