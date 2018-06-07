const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();

const clientPath = __dirname + "/../client";
console.log("Serving files to client " + clientPath);

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

let clients = {};
let rooms = {};
let hosts = {};
let userRoom = {};


io.on('connection', function(sock){
    
    sock.on("room", function(info){
        
       if(!rooms.hasOwnProperty(info[0])) {
            sock.join(info[0]);
            clients[sock.id] = info[1];
            rooms[info[0]] = true;
            hosts[info[0]] = sock.id;
            userRoom[sock.id] = info[0];

            console.log(clients[sock.id] + " joined " + info[0]);
        } else if(rooms.hasOwnProperty(info[0])) {
            if(rooms[info[0]] == true) {
                sock.join(info[0]);
                clients[sock.id] = info[1];
                rooms[info[0]] = true;
                userRoom[sock.id] = info[0];

                io.to(hosts[info[0]]).emit("joined", [sock.id, info[1]]);
                
                console.log(clients[sock.id] + " joined " + info[0]);                
            } else {
                io.emit("false", "cannot connect");
                console.log("failed connection");
            }
        } 

    });

    sock.on("noOfPlayers", function(data){

        let no = io.sockets.adapter.rooms[data].length;
        io.in(data).emit("players", no);
    
    }); 

    sock.on("close", function(room) {
        rooms[room] = false;
    });

    sock.on("question", function(data){
        io.in(data[1]).emit("question", data[0]);
    });

    sock.on("answer", function(data){

        let r = userRoom[sock.id];
        let h = hosts[r];

        io.to(h).emit("ans", [sock.id, data]);

    });

    sock.on("correct", function(data){

        io.to(data[0]).emit("correct", data);

    });

    sock.on("incorrect", function(data){

        io.to(data[0]).emit("incorrect", data);

    });

    sock.on("end", function(data){
        let y = Object.keys(data);
        y.forEach(function(prop) {
            io.to(prop).emit("finish", data[prop]);
		});

    });

    sock.on("disconnect", function(data) {
        let r = userRoom[sock.id];
        let h = hosts[r];
        
        if(clients.hasOwnProperty(sock.id)) {
            console.log(clients[sock.id] + " disconnected");
            io.to(h).emit("dc", sock.id);
        }

        if(sock.id == h) {
            console.log("Host " + clients[sock.id] + " Disconnected");
            io.in(userRoom[sock.id]).emit("hostDisconnect", "Host has disconnected");

        }

        delete userRoom[sock.id];
        delete clients[sock.id];
        delete rooms[r];
        delete hosts[r];
    });

    
});



server.on("error", function(err) {
    console.log(err);
});


server.listen(8080, function() {
    console.log("Server listening on port 8080")
});
