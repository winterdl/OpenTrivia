const sock = io();

function shuffleArray(array) {
	
	for(let i = array.length - 1; i > 0; i--) {
		
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
		
	}
	return array;
	
}

//Global Variables
var obj = null;
let question = null;
let score = 0;
let questionNo = 0;
let globcrc = "";
let room = null;

sock.on("msg", function(msg) {
    console.log(msg);
});

sock.on("hostDisconnect", function(msg) {
    document.getElementById("q").innerHTML = "";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("disconnect").style.display =""; 
    let selection = document.createElement("DIV");
    let txt = document.createTextNode("Restart");
    selection.appendChild(txt);
    selection.setAttribute("onClick",'location.href="join.html"');
    selection.setAttribute("class","option");
    selection.setAttribute("id","restart");
    document.getElementById("answers").appendChild(selection);  

});

sock.on("question", function(data){
    question = data;
    nextQuestion();
    console.log(question.question);
});

sock.on("correct", function(data){
    let selection = document.createElement("DIV");
    let txt = document.createTextNode("Correct!" + " Your Current Score is: " + data[1]);
    selection.appendChild(txt);
    selection.setAttribute("class","correct");
    document.getElementById("answers").appendChild(selection);
});

sock.on("incorrect", function(data){
    let selection = document.createElement("DIV");
    let txt = document.createTextNode("Incorrect!" + " The correct Answer was: " + data[2] +" Your Current Score is: " + data[1]);
    selection.appendChild(txt);
    selection.setAttribute("class","incorrect");
    document.getElementById("answers").appendChild(selection);   
});

sock.on("finish", function(data){
    console.log(data);

    document.getElementById("answers").innerHTML = "";
    document.getElementById("q").innerHTML = "";

    let selection = document.createElement("DIV");
    let txt = document.createTextNode("Your Score: " + data);
    selection.appendChild(txt);
    selection.setAttribute("class","modifiers");
    document.getElementById("answers").appendChild(selection);

    let selection2 = document.createElement("DIV");
    let txt2 = document.createTextNode("Main Menu");
    selection2.appendChild(txt2);
    selection2.setAttribute("onClick",'location.href="index.html"');
    selection2.setAttribute("class","option");
    selection2.setAttribute("id","restart");
    document.getElementById("answers").appendChild(selection2); 

    let selection3 = document.createElement("DIV");
    let txt3 = document.createTextNode("Join Again");
    selection3.appendChild(txt3);
    selection3.setAttribute("onClick",'location.href="join.html"');
    selection3.setAttribute("class","option");
    selection3.setAttribute("id","restart");
    document.getElementById("answers").appendChild(selection3); 
});


function load() {
    
    document.getElementById("waiting").style.display ="none";
    document.getElementById("disconnect").style.display ="none";


}

document.addEventListener("DOMContentLoaded", function() {
    load();
});

function joinRoom() {

    let room = (document.getElementById("room").value).toString();
    let name = (document.getElementById("name").value).toString();
    sock.emit("room", [room, name]);
    document.getElementById("config").style.display ="none";
    document.getElementById("join").style.display ="none";
    document.getElementById("waiting").style.display ="";


}

function nextQuestion(){

    document.getElementById("waiting").style.display = "none";

    document.getElementById("answers").innerHTML = "";
    //sock.emit("question", [questions[0], room]);
    
    
    let inc = question.incorrect_answers;
    let crc = question.correct_answer;
    globcrc = crc;
    let options = inc.concat(crc);
    shuffleArray(options);
    questionNo = questionNo + 1;
    document.getElementById("q").innerHTML = questionNo + ") " + question.question;

    for(let i = 0; i < options.length; i++) {
        let selection = document.createElement("DIV");
        let txt = document.createTextNode(options[i]);
        selection.appendChild(txt);
        selection.setAttribute("value",options[i]);
        selection.setAttribute("class","option");
        selection.setAttribute("onClick","sendAnswer(this)");
        document.getElementById("answers").appendChild(selection);
    } 

}

function sendAnswer(ans) {
    
    let answer = ans.innerHTML;
    sock.emit("answer",answer);

    document.getElementById("answers").innerHTML = "";
    let selection = document.createElement("DIV");
    let txt = document.createTextNode("Waiting for other players to answer...");
    selection.appendChild(txt);
    selection.setAttribute("class","modifiers");
    document.getElementById("answers").appendChild(selection);

}