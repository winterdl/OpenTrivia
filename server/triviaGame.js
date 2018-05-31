
const request = require("request");

class triviaGame {

    getQ (url) {

        
 

    }
    
    fetchCategories(player1) {
        let catUrl = "https://opentdb.com/api_category.php";
        request("https://opentdb.com/api_category.php", {json:true}, function(error, response, body){
            
            let categories = body.trivia_categories;
            console.log(categories);
            player1.emit("cat", categories);

         });   


        //let categories = catObj.trivia_categories;
       // console.log(categories[0]);
        //player1.emit("categories", categories);


    }

    
    
    setupGame(player1, player2, settings) {

        console.log("running");
        /*
        player1.on("config", function(settings){
            
            let noQ = settings[0].toString();
            let cat = settings[1].toString();
            let dif = settings[2].toString();
            //console.log(typeof noQ);
            let gameURL = "";
            
            if((cat == "" && dif == "")) {
                gameURL = "https://opentdb.com/api.php?amount=" + noQ;
            } else if(cat == "" && dif != "") {
                gameURL = "https://opentdb.com/api.php?amount=" + noQ + "&difficulty=" + dif;
            } else if(cat != "" && dif == "") {
                gameURL ="https://opentdb.com/api.php?amount=" + noQ + "&category=" + cat;
            } else {
                gameURL = "https://opentdb.com/api.php?amount=" + noQ + "&category=" + cat + "&difficulty=" + dif;
        
            }

            console.log(gameURL)
            return gameURL;
        });  */
        


    }



}

module.exports = triviaGame;