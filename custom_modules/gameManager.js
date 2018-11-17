module.exports = {
 
    // Checks whether an JS Object contains an element with the provided key.
    doesExist: function(value, obj) {
        if(obj[value] == null) {
            return false
        } else return true
    },

    // Sets the host of a game instance and returns a new game object
    createGame: function(hostID){
        let game = {
            host: hostID,
            players: []
        }
        return game;
    },

    // Creates a player object and initialises basic properties
    createPlayer: function(playerName, socketID){
        let player = {
            username: playerName,
            id: socketID,
            score: 0
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



    
};