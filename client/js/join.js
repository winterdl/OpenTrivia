const socket = io();

socket.on("joinedRoom", function() {
    var template = jQuery("#lobby-template").html();
    var lobby = Mustache.render(template, {text: "Waiting for other Players"});
    jQuery("#main").html("").append(lobby);
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