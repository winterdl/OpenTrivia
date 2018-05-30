function shuffleArray(array) {
	
	for(let i = array.length - 1; i > 0; i--) {
		
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
		
	}
	return array;
	
}

function getQ (url) {
	
	var Httpreq = new XMLHttpRequest();
	Httpreq.open("GET",url,false);
	Httpreq.send(null);
	return Httpreq.responseText;
	
}

function load() {
	if (typeof window.orientation !== 'undefined') { 
		let css = document.getElementById("css");
		//css.href = "mobile.css";
	 }
	let q1 = document.createElement("DIV");
	q1.setAttribute("id","q");
	q1.setAttribute("class","q");
	document.getElementById("playArea").appendChild(q1);


	let catUrl = "https://opentdb.com/api_category.php";
	let catObj = JSON.parse(getQ(catUrl));
	let categories = catObj.trivia_categories;
	
	
	for(let i = 0; i < categories.length; i++) {
	let catID = categories[i].id;
	let catName = categories[i].name;
	
	let opt = document.createElement("OPTION");
	opt.text = catName;
	opt.value = catID;
	document.getElementById("cat").appendChild(opt);
	
	}

	

}

//Global Variables
var obj = null;
let questions = null;
let score = 0;
let questionNo = 0;
let globcrc = "";

function setupGame() {

	let noQ = (document.getElementById("noq").value).toString();
	let cat = (document.getElementById("cat").value).toString();
	let dif = (document.getElementById("dif").value).toString();

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

	//console.log(gameURL);
	obj = JSON.parse(getQ(gameURL));
	questions = obj.results;
	nextQuestion();

}

document.addEventListener("DOMContentLoaded", function() {
  load();
});

function nextQuestion() {
	
	if (questions.length > 0) {
		document.getElementById("start").style.display = "none";
		document.getElementById("config").style.display = "none";
		//document.getElementById("logo").style.display = "none";
		document.getElementById("answers").innerHTML = "";
		let inc = questions[0].incorrect_answers;
		let crc = questions[0].correct_answer;
		globcrc = crc;
		let options = inc.concat(crc);
		shuffleArray(options);
		questionNo = questionNo + 1;
		document.getElementById("q").innerHTML = questionNo + ") " + questions[0].question;
	
		for(let i = 0; i < options.length; i++) {
			let selection = document.createElement("DIV");
			let txt = document.createTextNode(options[i]);
			selection.appendChild(txt);
			selection.setAttribute("value",options[i]);
			selection.setAttribute("class","option");
			selection.setAttribute("onClick","checkAns(this)");
			document.getElementById("answers").appendChild(selection);
		} 
	} else {
		document.getElementById("answers").innerHTML = "";
		document.getElementById("q").innerHTML = "Your Score: " + score;
		//document.getElementById("answers").innerHTML ="Your Score: " + score;
		let selection = document.createElement("DIV");
		let txt = document.createTextNode("Restart");
		selection.appendChild(txt);
		selection.setAttribute("onClick",'location.href="index.html"');
		selection.setAttribute("class","option");
		selection.setAttribute("id","restart");
		document.getElementById("answers").appendChild(selection);	
	}
	
}

function checkAns(objButton) {
	//console.log(objButton.value);
	if(objButton.innerHTML == globcrc) {
	console.log("correct");
	score = score + 1;
	let feedback = document.createElement("DIV");
	let txt = document.createTextNode("Correct!");
	feedback.setAttribute("class","correct")
	feedback.appendChild(txt);
	document.getElementById("answers").appendChild(feedback);
	} else {
		console.log("incorrect");
		let feedback = document.createElement("DIV");
		let txt = document.createTextNode("Incorrect!");
		feedback.setAttribute("class","incorrect")
		feedback.appendChild(txt);
		document.getElementById("answers").appendChild(feedback);
		
	}

	questions.shift();
	setTimeout(function(){
		nextQuestion()
	},350);
	
}
