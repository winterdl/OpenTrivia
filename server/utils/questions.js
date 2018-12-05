const axios = require("axios");

module.exports = {

    getCategories: async () => {
        try {
            var response = await axios.get("https://opentdb.com/api_category.php");
            return response.data;
        } catch (error) {
            throw new Error("Unable to fetch categories", error);
        };

    },

    getQuestions: async (category, difficulty, questions) => {
        var url;
        if(category === "0" && difficulty === "any") {
            url = `https://opentdb.com/api.php?amount=${questions}&encode=url3986`;
        } else if(category === "0") {
            url = `https://opentdb.com/api.php?amount=${questions}&difficulty=${difficulty}&encode=url3986`;
        } else if(difficulty === "any") {
            url = `https://opentdb.com/api.php?amount=${questions}&category=${category}&encode=url3986`;
        } else {
            url = `https://opentdb.com/api.php?amount=${questions}&category=${category}&difficulty=${difficulty}&encode=url3986`;
        };

        try {
            var response = await axios.get(url);
            return response.data.results;
        } catch (error) {
            throw new Error("Unable to fetch questions", error);
        }

    },

    shuffleArray: (array) => {
    
        for(var i =0; i < array.length; i++) {
            array[i] = decodeURIComponent(array[i]);
        }

        for(let i = array.length - 1; i >= 0; i--) {
            
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
            
        }
        return array;
        
    }


};