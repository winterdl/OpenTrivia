const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = __dirname + "/client";
console.log("Serving files to client " + clientPath);

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

//Stores all running games
let games = {};
io.on('connection', function(socket){
    console.log(socket.id + " connected!")
});





server.on("error", function(err) {
    console.log(err);
});


server.listen(process.env.PORT || 5000);



