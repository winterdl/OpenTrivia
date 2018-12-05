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
            var g = games.getGameByRoom(config.room);
            if(g && g.active) {
                return socket.emit("ERROR", {
                    code: "NAMEERROR",
                    msg: `Cannot join room ${config.name}. Game has already started.`
                });
            }

            if(!games.checkRoomName(config.room)) {
                if(games.checkUsername(config.room, config.name)) {
                    games.addPlayer(config.room, config.name, socket.id);
                    socket.join(config.room);
                    socket.emit("joinedRoom");
                    var game = games.getGameByRoom(config.room);
                    io.to(game.host).emit("PLAYER-CONNECTED", {name: config.name});
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
        if(roomName) {

            var players = games.getFromRoom(roomName);

            if(players.length > 0) {

                var question = setupQuestion(roomName);
                games.getGameByHost(socket.id).active = true;
                games.setWaiting(roomName);
                io.to(roomName).emit("newQuestion", question);
            } else {
                socket.emit("ERROR", {
                    code: "STARTERROR",
                    msg: "Not enough players to start the game."
                });
            }


        } else {
            // Add error handling!
        }
    });

    socket.on("submitAnswer", (ans) => {
        var player = games.getPlayerBySocket(socket.id);
        if(player) {
            var question = games.getCurrentQuestion(player.room);
            console.log(decodeURIComponent(question.correct_answer), ans);
            if(decodeURIComponent(question.correct_answer) === ans) {
                var p = games.updateScore(socket.id, 1);
                socket.emit("correctAnswer", p.score);
            } else {
                socket.emit("incorrectAnswer", {correct: question.correct_answer, score: player.score});
            }

            games.updateWaiting(player.room);

            var waiting = games.getWaiting(player.room);

            if(waiting === 0) {
                var remaining = games.availableQuestions(player.room);
                if(remaining === 1) {
                    console.log(`${player.room} finished!`);
                    var players = games.getFromRoom(player.room);
                    var response = [];
                    players.forEach((player) => {
                        var p = {
                            name: player.username,
                            score: player.score
                        };
                        response.push(p);
                    })
                    io.to(player.room).emit("gameFinished", response);
                } else {
                    games.nextQuestion(player.room);
                    var res = setupQuestion(player.room);
                    games.setWaiting(player.room);
                    io.to(player.room).emit("newQuestion", res);
                }

            };

            
        };
    });

    
    socket.on("disconnect", () => {
        var type = games.isHostOrPlayer(socket.id);

        if(type === "HOST") {
            var game = games.removeGame(socket.id);
            var players = games.removeFromRoom(game.room);
            players.forEach((player) => {
                io.emit("HOST-DISCONNECT");
            });
        } else if(type === "PLAYER") {
            var player = games.removePlayer(socket.id);
            var players = games.getFromRoom(player.room);
            var game = games.getGameByRoom(player.room);
            
            if(game.active) {
                if(players.length > 0) {
                    games.setWaiting(player.room);
                    io.to(player.room).emit("PLAYER-DISCONNECT", {name: player.username, score: player.score});
                } else {
                    var game = games.getGameByRoom(player.room);
                    games.removeGame(game.host);
                    var hostSocket = io.sockets.connected[game.host];
                    hostSocket.leave(game.room);
                    io.to(game.host).emit("ALL-DISCONNECT")
                    console.log(games.games, "    ", games.players);
                };
            } else {
                io.to(player.room).emit("PLAYER-DISCONNECT", {name: player.username, score: player.score});
            };
            
        };
    })
})




function setupQuestion(roomName) {
    var fullQuestion = games.getCurrentQuestion(roomName);
    var options = fullQuestion.incorrect_answers.concat(fullQuestion.correct_answer);
    var shuffledOptions = shuffleArray(options);
    var question = {
        category: decodeURIComponent(fullQuestion.category),
        type: fullQuestion.type,
        question: decodeURIComponent(fullQuestion.question),
        options: shuffledOptions
    };

    return question;
;}



app.use(express.static(publicPath));
server.listen(process.env.PORT || 5000, () => {
    console.log("Started Server!");
})

