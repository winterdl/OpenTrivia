
/*function writeEvent(text) {
    let chatbox = document.getElementById("events");
    let listEl = document.createElement("li");
    listEl.innerHTML = text;
    chatbox.appendChild(listEl);
} */

const sock = io();
//sock.on('message', writeEvent);

sock.on("choice", function(string){
    console.log("YES");
    document.getElementById("config").style.display = ""; 
    document.getElementById("start").style.display = "";
    document.getElementById("waiting").style.display = "none";

});

sock.on("clear", function(clear){
    console.log("HI");
    document.getElementById("waiting").style.display = "none";    

});

function sendMessage(event) {
    event.preventDefault();
    let msg = document.getElementById("chat").value;
    
    sock.emit('message', msg);
}
let availCat = null;
function load() {
    document.getElementById("config").style.display = "none"; 
    document.getElementById("start").style.display = "none";

    sock.on("cat", function(categories){
        availCat = categories;
        for(let i = 0; i < availCat.length; i++) {
            let catID = availCat[i].id;
            let catName = availCat[i].name;
            
            let opt = document.createElement("OPTION");
            opt.text = catName;
            opt.value = catID;
            document.getElementById("cat").appendChild(opt);
            
        }

    });




}

document.addEventListener("DOMContentLoaded", function() {
    load();
});



function gameConfig() {

	let noQ = (document.getElementById("noq").value).toString();
	let cat = (document.getElementById("cat").value).toString();
    let dif = (document.getElementById("dif").value).toString();
    document.getElementById("config").style.display = "none"; 
    document.getElementById("start").style.display = "none";
    sock.emit("settings", [noQ, cat, dif]);
    


}


