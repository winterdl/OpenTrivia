const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const manager = require('./modules/gameManager.js');

const app = express();
const clientPath = __dirname + "/client";
app.use(express.static(clientPath));
console.log("Serving files to client " + clientPath);


const server = http.createServer(app);
const io = socketio(server);

//Stores all running games
let games = {};
io.on('connection', function(socket){
    console.log(socket.id + " connected!")

    socket.on("verifyRoom", function(data){
        if(!manager.doesExist(data, games)) {
            let game = manager.createGame(socket.id, data);
            games[data] = game;
            console.log("New Game Created: " + game.toString());
            io.sockets.connected[socket.id].emit("roomAvailable", true);
        } else (io.sockets.connected[socket.id].emit("roomAvailable", false))
    });


    

    socket.on("disconnect", function(data){
        let query = manager.getClientType(socket.id, games);
        if(query == undefined) {
            console.log(socket.id + " " + "disconnected from join screen.");
        } else if(query[0] == "host") {
            delete games[query[1]];
            io.in(query[1]).emit("hostDisconnected");
            console.log("Host " + socket.id + " disconnected.\n" + "Room " + query[1] + " has been deleted!");
        } else if(query[0] == "player") {
            let response = manager.removePlayer(socket.id, games[query[1]].playerList);
            games[query[1]].playerList = response[0];
            io.in(query[1]).emit("playerDisconnected", response[1]);
            console.log(response[1] + " disconnected and removed from room " + query[1]);
        }
    });
});





server.on("error", function(err) {
    console.log(err);
});


server.listen(process.env.PORT || 5000);



