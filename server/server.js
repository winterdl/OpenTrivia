const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const triviaGame = require("./triviaGame");

const app = express();

const clientPath = __dirname + "/../client";
console.log("Serving files to client " + clientPath);

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

let waitingPlayer = null;
let game = new triviaGame();
let url = null;
let p2 = null;
io.on('connection', function(sock){
    //p2 = sock;
    console.log("Connection established: " + sock.id);
    if(waitingPlayer) { 
        game.fetchCategories(waitingPlayer);
        waitingPlayer.emit("choice", "run");
        
        waitingPlayer.on("settings", function(options){
           sock.emit("clear", "msg");
           game.setupGame(waitingPlayer, sock, options)           
        });

        waitingPlayer = null;
    } else {
        waitingPlayer = sock;
    }


    
});



server.on("error", function(err) {
    console.log(err);
});


server.listen(8080, function() {
    console.log("Server listening on port 8080")
});
