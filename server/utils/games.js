const {getQuestions} = require("./questions");

class GameManager {
    constructor() {
        this.games = [];
        this.players = [];
        this.quizzes = {};
    }

    addGame(hostID, roomName, category, difficulty, questions) {
        let game = {
            host: hostID,
            room: roomName,
            active: false
        }
        this.games.push(game);

        getQuestions(category, difficulty, questions).then((res) => {

            var quiz = {
                qs: res,
                waiting: 0
            }

            this.quizzes[roomName] = quiz;
            
            
        }).catch((e) => {
            console.log(e);
        });

        return game
        
    };

    getCurrentQuestion(room) {
        return this.quizzes[room].qs[0];
    };

    nextQuestion(room) {
        this.quizzes[room].qs.shift();
        //console.log(this.quizzes[room].qs);

    };

    availableQuestions(room) {
        return this.quizzes[room].qs.length;
    };

    setWaiting(room) {
        var val = this.getFromRoom(room).length;
        this.quizzes[room].waiting = val;
        //console.log("waiting", val);
    };

    updateWaiting(room) {
        if(this.quizzes[room].waiting > 0) {
            this.quizzes[room].waiting -= 1;
        }
        //console.log("updated waiting!");
    };

    getWaiting(room) {
        return this.quizzes[room].waiting;
    };

    updateScore(socketID, points) {
        var player = this.getPlayerBySocket(socketID);
        if(player) {
            var i = this.players.findIndex((p) => {
                return p.id === socketID; 
            });
            this.players[i].score += points;
        };
        //console.log("Updated Score!");
        return this.getPlayerBySocket(socketID);

    };

    addPlayer(room, name, socketID) {
        var player = {
            username: name,
            id: socketID,
            room,
            score: 0
        };

        this.players.push(player);
        return player;
    };

    removeGame(socketID) {
        var game = this.getGameByHost(socketID);

        if(game) {
            this.games = this.games.filter((game) => {
                return game.host != socketID;
            });

            delete this.quizzes[game.room];
        };

        return game;
    };

    removePlayer(socketID) {
        var player = this.getPlayerBySocket(socketID);

        if(player) {
            this.players = this.players.filter((player) => {
                return player.id != socketID;
            });
        };

        return player;
    };

    removeFromRoom(room) {
        var removedPlayers = [];

        this.players = this.players.filter((player) => {
            if(player.room === room) {
                removedPlayers.push(player);
            } else {
                return player;
            };
        });

        return removedPlayers;
    };

    getFromRoom(room) {

        var players = this.players.filter((player) => {
            return player.room === room;
        });

        return players;
    };

    isHostOrPlayer(socketID) {
        if(this.getGameByHost(socketID) != undefined) {
            return "HOST";
        } else if(this.getPlayerBySocket(socketID) != undefined) {
            return "PLAYER";
        } else return "NOTFOUND";

    };

    getGameByHost(hostID) {
        return this.games.filter((game) => {
            return game.host === hostID;
        })[0];
    };

    getGameByRoom(roomName) {
        return this.games.filter((game) => {
            return game.room === roomName;
        })[0];
    };

    getPlayerBySocket(socketID) {
        return this.players.filter((player) => {
            return player.id === socketID;
        })[0];
    };

    checkUsername(room, username) {
        var players = this.getFromRoom(room);
        var available = true;

        players.filter((player) => {
            if(player.username === username) {
                available = false;
            };
        });
        
        return available;
    };

    checkRoomName(room) {
        var game = this.getGameByRoom(room);

        if(game) {
            return false;
        } else {
            return true;
        };

    };
}

module.exports = {GameManager}