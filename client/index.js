//Global Variables
const sock = io();
var obj = null;
let questions = null;
let score = {};
let questionNo = 0;
let globcrc = "";
let room = null;
let noOfplayers = null;
let ready = 0;
let players = {};
let avail;
let gameState = false;
let load;
function getQ (url) {
	
	var Httpreq = new XMLHttpRequest();
	Httpreq.open("GET",url,false);
	Httpreq.send(null);
	return Httpreq.responseText;
	
}

function shuffleArray(array) {
	
	for(let i = array.length - 1; i > 0; i--) {
		
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
		
	}
	return array;
	
}

function aboutModal(data) {
    if(data == 0) {
        document.getElementById("about-modal").className += " is-active";
    } else if(data == 1) {
        document.getElementById("about-modal").className = "modal";
    }

}

function updateLoad() {
    load = 100;
    document.getElementById("loadbar").setAttribute("value","100")
    if(load == 100) {
        document.getElementById("loadContainer").style.display = "none";
    }
}

// Socket.io handling


sock.on("players", function(data){
	noOfplayers = data - 1;
	//console.log(noOfplayers);
});

sock.on("available", function(data){
    avail = data;
});

sock.on("joined", function(data){
	//console.log(data[0] + " " + data[1]);
	players[data[0]] = data[1];
	score[data[0]] = 0;
	document.getElementById("lobby").innerHTML += "<br>" + data[1];
});

sock.on("ans", function(data){
	//console.log(data[1]);
	checkAns(data);
});

sock.on("dc", function(data){
	if(gameState) {
		document.getElementById("roomCode").style.display = "none";
		document.getElementById("waiting").style.display = "none";
		document.getElementById("lobby").style.display = "none";
		document.getElementById("begin").style.display = "none";
		
		document.getElementById("q").innerHTML = "";
		document.getElementById("answers").innerHTML = "";
		document.getElementById("disconnect").style.display ="";
		document.getElementById("disconnect").innerHTML = players[data] + " has disconnected! Game Over."
		let selection = document.createElement("DIV");
		let txt = document.createTextNode("Main Menu");
		selection.appendChild(txt);
		selection.setAttribute("onClick",'location.href="index.html"');
		selection.setAttribute("class","option");
		selection.setAttribute("id","restart");
		document.getElementById("answers").appendChild(selection); 
	} else {
		let h = document.getElementById("lobby").innerHTML;
		let nh = h.replace(("<br>"  + players[data]), "");
		document.getElementById("lobby").innerHTML = nh;
	}

});


document.addEventListener("DOMContentLoaded", function() {
    
	document.getElementById("qrCode").style.display = "none";
	document.getElementById("lobby").style.display = "none";
	document.getElementById("beginContainer").style.display = "none"; 
	document.getElementById("room-help").style.display = "none"; 
	document.getElementById("answers").style.display = "none";
	
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

    let navBurger = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    if (navBurger.length > 0) {
        navBurger.forEach(function (element) {
            element.addEventListener('click', function () {
                let target = element.dataset.target;
                let targetData = document.getElementById(target);
                element.classList.toggle('is-active');
                targetData.classList.toggle('is-active');
    
            });
         });
    }

});

function checkRoom() {
    let rc = document.getElementById("roomCode").value.trim();
	if(rc == "") {
		document.getElementById("room-help").innerHTML = "You need to enter a room code to continue."
		document.getElementById("room-help").style.display = ""; 
        document.getElementById("roomCode").value = "";
		return;
    } 

    sock.emit("checkRoom", document.getElementById("roomCode").value);

    setTimeout(function(){
        //Timeout function to ensure that we have recieved a response from the server before executing the next block of code.
        if(!avail) {
           gameConfig();
        } else {
			document.getElementById("room-help").innerHTML = "Room name is taken. Please try again. Room codes are case sensitive and can include spaces."
            document.getElementById("room-help").style.display = ""; 
            return;
        }
        
    },1000);
}


function gameConfig() {

	let noQ = (document.getElementById("noQ").value).toString();
	let cat = (document.getElementById("cat").value).toString();
    let dif = (document.getElementById("dif").value).toString();
	
    room = (document.getElementById("roomCode").value).toString();
    document.getElementById("welcome").style.display ="";
    document.getElementById("options").style.display = "none"; 
    document.getElementById("play").style.display = "none";
    sock.emit("hostConnect", [room, name]);

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


	obj = JSON.parse(getQ(gameURL));
	questions = obj.results;
	
	//https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example
	document.getElementById("msg").innerHTML = "Room Code: " + room + " <br> Go to <a href='https://alingam-quizdemo.herokuapp.com/join.html'>https://alingam-quizdemo.herokuapp.com/join.html</a>";
	let roomInfo = "https://alingam-quizdemo.herokuapp.com/join.html?room=" + room; 
	let qr = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + roomInfo;


    document.getElementById("code").setAttribute("src",qr);
	document.getElementById("qrCode").style.display = "";
	document.getElementById("lobby").style.display = "";   
	document.getElementById("beginContainer").style.display = "";       
}

function beginGame() {
	sock.emit("noOfPlayers", room);

	setTimeout(function(){
		if(noOfplayers > 0) {
			document.getElementById("beginContainer").style.display = "none";
			document.getElementById("lobby").style.display = "none";
			document.getElementById("msg").style.display = "none";
			document.getElementById("roomCode").style.display ="none";
			document.getElementById("qrCode").style.display ="none";
			sock.emit("close", room);
			gameState = true;
			nextQuestion();
		} else {
			alert("You need atleast 1 player to start the game.")
		}
	},500);
}

function nextQuestion(){

	if(questions.length > 0) {
		ready = 0;
		document.getElementById("play").style.display = "none";
		document.getElementById("options").style.display = "none";
		document.getElementById("answers").style.display = "";
		document.getElementById("msg").style.display = "";
		sock.emit("question", [questions[0], room]);
		
		
		let inc = questions[0].incorrect_answers;
		let crc = questions[0].correct_answer;
		globcrc = crc;
		let options = inc.concat(crc);
		shuffleArray(options);
		questionNo = questionNo + 1;
		document.getElementById("msg").innerHTML = questionNo + ") " + questions[0].question;
	
		for(let i = 0; i < options.length; i++) {
			let selection = document.createElement("DIV");
			let txt = document.createTextNode(options[i]);
			selection.appendChild(txt);
			selection.setAttribute("value",options[i]);
			selection.setAttribute("class","notification is-primary ans");
			document.getElementById("answers").appendChild(selection);
		} 
	} else {

		
		document.getElementById("answers").innerHTML = "";
		document.getElementById("q").innerHTML = "";
		let y = Object.keys(score);
		sock.emit("end", score);
		y.forEach(function(prop) {
			//console.log(prop, " = ", score[prop]);
			let selection = document.createElement("DIV");
			let txt = document.createTextNode(players[prop] + " Score: " + score[prop]);
			selection.appendChild(txt);
			selection.setAttribute("class","modifiers");
			document.getElementById("answers").appendChild(selection);
		});

		let selection = document.createElement("DIV");
		let txt = document.createTextNode("Main Menu");
		selection.appendChild(txt);
		selection.setAttribute("onClick",'location.href="index.html"');
		selection.setAttribute("class","option");
		selection.setAttribute("id","restart");
		document.getElementById("answers").appendChild(selection); 

	}
}