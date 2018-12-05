const socketio = require("socket.io");
const express = require("express");
const http = require("http");
const path = require("path");

const {GameManager} = require("./utils/games");
const {isValidString} = require("./utils/validate");
const {getCategories, shuffleArray} = require("./utils/questions");
const publicPath = path.join(__dirname, "../client");

var app = express();
var server = http.createServer(app);
var io = socketio(server);
var games = new GameManager();

io.on("connection", (socket) => {
    console.log(`${socket.id} connected!`);

    getCategories().then((res) => {
        socket.emit("categories", res.trivia_categories);
    }).catch((err) => {
        console.log(err);
    });

    socket.on("createRoom", (config) => {
        if(isValidString(config.room)) {
            if(games.checkRoomName(config.room)) {
                games.addGame(socket.id, config.room, config.category, config.difficulty, config.questions);
                socket.join(config.room);
                socket.emit("roomCreated");
                console.log(games.games);
            } else {
                socket.emit("ERROR", {
                    code: "ROOMERROR",
                    msg: `Room name ${config.room} is taken. Please try another name.`
                });                
            }
        } else {
            socket.emit("ERROR", {
                code: "ROOMERROR",
                msg: `Cannot use empty string for room name.`
            });
        }
    });

    socket.on("joinRoom", (config) => {
        if(isValidString(config.name) && isValidString(config.room)) {
            if(!games.checkRoomName(config.room)) {
                if(games.checkUsername(config.room, config.name)) {
                    games.addPlayer(config.room, config.name, socket.id);
                    socket.join(config.room);
                    socket.emit("joinedRoom");
                    var game = games.getGameByRoom(config.room);
                    io.to(game.host).emit("PLAYER-CONNECTED", {name: config.name});
                    console.log(games.players);
                } else {
                    socket.emit("ERROR", {
                        code: "NAMEERROR",
                        msg: `${config.name} is already being used in room: ${config.room}`
                    });                   
                }
            } else {
                socket.emit("ERROR", {
                    code: "NAMEERROR",
                    msg: "Room does not exist!"
                });
            };
        } else {
            socket.emit("ERROR", {
                code: "NAMEERROR",
                msg: `Please enter both the room name and username.`
            });
        }
    })

    socket.on("startGame", () => {
        var roomName = games.getGameByHost(socket.id).room;
        var fullQuestion = games.getCurrentQuestion(roomName);
        var options = fullQuestion.incorrect_answers.concat(fullQuestion.correct_answer);
        var shuffledOptions = shuffleArray(options);
        var question = {
            category: decodeURIComponent(fullQuestion.category),
            type: fullQuestion.type,
            question: decodeURIComponent(fullQuestion.question),
            options: shuffledOptions
        };

        io.to(roomName).emit("newQuestion", question);
    });
    socket.on("disconnect", () => {
        var type = games.isHostOrPlayer(socket.id);

        if(type === "HOST") {
            var game = games.removeGame(socket.id);
            var players = games.removeFromRoom(game.room);
            players.forEach((player) => {
                io.emit("HOST-DISCONNECT");
            });

            console.log(games.games);
        } else if(type === "PLAYER") {
            var player = games.removePlayer(socket.id);
            io.to(player.room).emit("PLAYER-DISCONNECT", {name: player.username, score: player.score});
        }
    })
})








app.use(express.static(publicPath));
server.listen(process.env.PORT || 5000, () => {
    console.log("Started Server!");
})

