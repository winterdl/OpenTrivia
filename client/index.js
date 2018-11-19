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
sock.on("roomAvailable", function(response){
	if(response) {
		setupGame();
	} else { alert("Room Name Taken!"); }
});

/*sock.on("joined", function(data){
	players[data[0]] = data[1];
	score[data[0]] = 0;
	document.getElementById("lobby").innerHTML += "<br>" + data[1];
});

sock.on("dc", function(data){
	if(gameState) {
		if(noOfplayers == 1) {
			sock.disconnect();
			document.getElementById("roomCode").style.display = "none";	
			document.getElementById("lobby").style.display = "none";
			document.getElementById("msg").innerHTML = "All players have disconnected! Game Over.";
			document.getElementById("answers").innerHTML = "";
			document.getElementById("endContainer").style.display = "";
		} else{
			noOfplayers = noOfplayers - 1;
			console.log(noOfplayers);
			delete players[data];
			delete score[data];
			changeQuestion();
		}

	} else {
		let h = document.getElementById("lobby").innerHTML;
		let nh = h.replace(("<br>"  + players[data]), "");
		document.getElementById("lobby").innerHTML = nh;
	}

}); */


document.addEventListener("DOMContentLoaded", function() {
    
	document.getElementById("qrCode").style.display = "none";
	document.getElementById("lobby").style.display = "none";
	document.getElementById("beginContainer").style.display = "none"; 
	document.getElementById("room-help").style.display = "none"; 
	document.getElementById("answers").style.display = "none";
	document.getElementById("endContainer").style.display = "none";
	document.getElementById("resultContainer").style.display = "none";
	
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

function verifyData(){
	if(document.getElementById("roomCode").value == "") {
		alert("please enter a room code!");
	} else{
		sock.emit("verifyRoom", document.getElementById("roomCode").value);
	}

};

function setupGame() {
	console.log("Setting up game!");
}