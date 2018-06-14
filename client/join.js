//Global Variables
const sock = io();
var obj = null;
let question = null;
let score = 0;
let questionNo = 0;
let globcrc = "";
let room = null;
let roomAvail;
let nameAvail;
let options;

function shuffleArray(array) {
	
	for(let i = array.length - 1; i > 0; i--) {
		
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
		
	}
	return array;
	
}

function updateLoad() {
    load = 100;
    document.getElementById("loadbar").setAttribute("value","100")
    if(load == 100) {
        document.getElementById("loadContainer").style.display = "none";
    }
}

function aboutModal(data) {
    if(data == 0) {
        document.getElementById("about-modal").className += " is-active";
    } else if(data == 1) {
        document.getElementById("about-modal").className = "modal";
    }

}

function qrRoom(param, element) {
    let url = window.location.href;
    if(url.indexOf("?") > -1) {
        let query = url.split("?");
        let rel = query[1];
        console.log(rel)
        let arg = rel.split("=");
        if(arg[0] == param) {
            console.log(arg[1]);
            document.getElementById(element).setAttribute("value", arg[1].toString());
        }
    } else return;
}

//socket.io message handling

sock.on("available", function(data){
    roomAvail = data;
});


sock.on("nameAvailable", function(data){
    nameAvail = data;
});

sock.on("hostDisconnect", function(msg) {
    document.getElementById("msg").innerHTML = "Host has disconnected from the game!";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("endContainer").style.display = "";
});

sock.on("question", function(data){
    question = data[0];
    options = data[1];
    nextQuestion();
});

sock.on("correct", function(data){
    let selection = document.createElement("DIV");
    let txt = document.createTextNode("Correct!" + " Your Current Score is: " + data[1]);
    selection.appendChild(txt);
    selection.setAttribute("class","notification is-success");
    document.getElementById("answers").appendChild(selection);
});

sock.on("incorrect", function(data){
    let selection = document.createElement("DIV");
    let txt = document.createTextNode("Incorrect!" + " The correct Answer was: " + data[2] +" Your Current Score is: " + data[1]);
    selection.appendChild(txt);
    selection.setAttribute("class","notification is-danger");
    document.getElementById("answers").appendChild(selection);   
});

sock.on("finish", function(data){

    document.getElementById("answers").innerHTML = "";
    document.getElementById("msg").innerHTML = "";

    let selection = document.createElement("DIV");
    let txt = document.createTextNode("Your Score: " + data);
    selection.appendChild(txt);
    selection.setAttribute("class","notification is-primary");
    document.getElementById("answers").appendChild(selection);

    document.getElementById("endContainer").style.display = "";
    document.getElementById("rejoin").style.display ="";
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("room-help").style.display ="none";
    document.getElementById("name-help").style.display ="none";
    document.getElementById("joinContainer").style.display ="none";
    document.getElementById("endContainer").style.display ="none";
    document.getElementById("rejoin").style.display ="none";
    

    qrRoom("room","roomCode");

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
    document.getElementById("name-help").style.display = "none";
    document.getElementById("room-help").style.display = "none";
    let rc = document.getElementById("roomCode").value.trim();
    let nm = document.getElementById("username").value.trim();
	if(rc == "" || nm =="") {
        document.getElementById("room-help").innerHTML = "Please enter a room code to continue.";
        document.getElementById("room-help").style.display = "";
        document.getElementById("name-help").innerHTML = "Please enter a username to continue.";
		document.getElementById("name-help").style.display = "";
        document.getElementById("roomCode").value = "";
        document.getElementById("username").value = "";
		return;
    } 

    sock.emit("checkRoom", document.getElementById("roomCode").value);
    sock.emit("checkName", [document.getElementById("username").value, sock.id]);

    if(typeof window.orientation !== "undefined") {
        setTimeout(function(){
            //Timeout function to ensure that we have recieved a response from the server before executing the next block of code.
            if(roomAvail && nameAvail) {
                joinRoom();
            } else if(roomAvail && !nameAvail){
                document.getElementById("name-help").innerHTML = "Username Taken. Please try again."
                document.getElementById("name-help").style.display = "";
                return;
            } else if(!roomAvail && nameAvail) {
                document.getElementById("room-help").innerHTML = "Room does not exist. Please try again. Remember the room code is case sensitive and can include spaces."
                document.getElementById("room-help").style.display = "";
            } else {
                document.getElementById("room-help").innerHTML = "Room does not exist. Please try again. Remember the room code is case sensitive and can include spaces."
                document.getElementById("room-help").style.display = "";
                document.getElementById("name-help").innerHTML = "Username Taken. Please try again."
                document.getElementById("name-help").style.display = "";
            }
            
        },2000);
    } else {
        setTimeout(function(){
            //Timeout function to ensure that we have recieved a response from the server before executing the next block of code.
            if(roomAvail && nameAvail) {
                joinRoom();
            } else if(roomAvail && !nameAvail){
                document.getElementById("name-help").innerHTML = "Username Taken. Please try again."
                document.getElementById("name-help").style.display = "";
                return;
            } else if(!roomAvail && nameAvail) {
                document.getElementById("room-help").innerHTML = "Room does not exist. Please try again. Remember the room code is case sensitive and can include spaces."
                document.getElementById("room-help").style.display = "";
            } else {
                document.getElementById("room-help").innerHTML = "Room does not exist. Please try again. Remember the room code is case sensitive and can include spaces."
                document.getElementById("room-help").style.display = "";
                document.getElementById("name-help").innerHTML = "Username Taken. Please try again."
                document.getElementById("name-help").style.display = "";
            }
            
        },1000);
    }
    

}

function joinRoom() {
    let room = (document.getElementById("roomCode").value).toString();
    let name = (document.getElementById("username").value).toString();
    sock.emit("room", [room, name]);
    document.getElementById("options").style.display ="none";
    document.getElementById("join").style.display ="none";
    document.getElementById("msg").innerHTML = "Waiting for host to start game..."
}

function nextQuestion(){

    document.getElementById("answers").innerHTML = "";
    
    let inc = question.incorrect_answers;
    let crc = question.correct_answer;
    globcrc = crc;
    questionNo = questionNo + 1;
    document.getElementById("msg").innerHTML = questionNo + ") " + question.question;

    for(let i = 0; i < options.length; i++) {
        let selection = document.createElement("DIV");
        let txt = document.createTextNode(options[i]);
        selection.appendChild(txt);
        selection.setAttribute("value",options[i]);
        selection.setAttribute("class","notification is-primary ans");
        selection.setAttribute("onClick","sendAnswer(this)");
        document.getElementById("answers").appendChild(selection);
    } 

}


function sendAnswer(ans) {
    
    let answer = ans.innerHTML;
    sock.emit("answer",answer);

    document.getElementById("answers").innerHTML = "";
    document.getElementById("msg").innerHTML = "Waiting for other players to answer..."

}
