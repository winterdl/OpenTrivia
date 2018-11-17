module.exports = {

    // Checks whether an JS Object contains an element with the provided key.
    doesExist: function(value, obj) {
        if(obj[value == null]) {
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
    removePlayer: function(sockedID, playerList){
        let remainingPlayers = [];
        for(player in playerList) {
            if(player.id != socketID) {
                remainingPlayers.push[player]
            }
        }
        return remainingPlayers;
    },

    // Pass in a socketID to determine whether the connected client is a PLAYER or HOST type.
    getClientType: function(socketID, activeGames){
        for(let game in activeGames) {
            if(game.host == socketID){
                return ["host", game]
            } else {
                let players = activeGames[game].players;
                for(player in players){
                    if(player.id == socketID){
                        return ["player", game, player];
                    }
                }
            }
        }
        
    }



}
