module.exports = {
 
    // Checks whether an JS Object contains an element with the provided key.
    doesExist: function(value, obj) {
        if(obj[value] == null) {
            return false
        } else return true
    },

    // Checks if username is taken
    checkUsername: function(playerName, roomName, activeGames){
        let playerList = activeGames[roomName].players;
        for(player in playerList) {
            if(playerList[player].username == playerName) {
                return false;
            }
        } 

        return true;

    },


    // Sets the host of a game instance and returns a new game object
    createGame: function(hostID, roomName){
        let game = {
            host: hostID,
            name: roomName,
            players: [],
            toString: function() {
                return ("Room Name: " + this.name + " | Host ID: " + this.host + " | Players: " + this.players.length );
            }
        }
        return game;
    },

    // Creates a player object and initialises basic properties
    createPlayer: function(playerName, socketID){
        let player = {
            username: playerName,
            id: socketID,
            score: 0,
            toString: function() {
                return ("Username: " + this.username + " | Socket ID: " + this.id);
            }
        }
        return player;
    },

    // Removes a player from a running game on client disconnect    
    removePlayer: function(socketId, playerList) {
        let remainingPlayers = [];
        let name ="";
       for (let i = 0; i < playerList.length; i++) {
            if(playerList[i].id == socketId) {
                name = playerList[i].username;
                
            } else {
                remainingPlayers.push(playerList[i]);
            }
        } 

        return [remainingPlayers, name];
    },

    // Pass in a socketID to determine whether the connected client is a PLAYER or HOST type.
    getClientType: function(socketId, gameList) {
        for(let game in gameList) {
            if(gameList[game].host == socketId) {
                return ["host", game];
            }
        }

        for(let game in gameList) {
            let players = gameList[game].players;
            for(player in players) {
                if(players[player].id == socketId) {
                    return ["player", game]; 
                }
            }
        }
    },

    // Generates easily readable string of passed in data.
    stringifyData: function(data, mode){
        // "GAMES" "PLAYERS" "ALL"
        var output = "";
        if(mode == "GAMES") {
            output = "Here is a list of active games: \n"
            for (game in data) {
               output +=  data[game].toString() + "\n";
            }
            return output;
        } else if(mode == "PLAYERS") {
            output = "Player Info: \n"
            for (player in data) {
                output += data[player].toString() + "\n";
            }

            return output;
        } else if(mode == "ALL") {
            output = "Here is a list of active games and player info: \n"
            for (game in data) {
               let output1 =  data[game].toString() + "\n " 
               let output2 = this.stringifyData(data[game].players, "PLAYERS");
               output += output1 + "\n" + output2 + "\n ******************* \n" ;
            }

            return output;
        } else return "Please choose a mode from the following ['GAMES', 'PLAYERS']";

        
    }

    
};