# OpenTrivia
Small multiplayer quiz demo using express and socket.io. [Click Here](https://alingam-quizdemo.herokuapp.com/) to view the live demo. 

Note: Using Free tier of cloud hosting for the node.js app so if the demo is offline then it has probably run out of free hours for the month so try again later.
### Current Status:
Some bugs exist but able to complete a full game.

Bugs/To-Do:
* Currently ends without warning if you request a category that does not have enough questions. Should check the status code returned from http request and handle appropriately to fix.
* Some text in the question or answer are not displayed correctly. Need to process responses to detect and display international unicode characters properly. 
* ~~Backend support exists to handle users attempting to join rooms that dont exist or are already in progress but need to implement the client side code to inform user.~~ 
* ~~generate QR code to join room is planned as well as potential application for mobile devices.~~
* While functional the GUI is quite ugly so that will need updating at some point.
* Implement way to play again with the same amount of players as well as showing all players and their respective scores througout the game rather than at the end.

### How to use locally:

* Requires: Node.JS and NPM 

* Clone the repository and run the following command to download all dependencies.
```
 npm install
```
* Now open a terminal run the following command if you just want to start the server.
```
npm node.js
```
Use this command if you are modifying the server for easier debugging. (Requires nodemon).
```
npm run dev
```
* Open the brower and navigate to http://localhost:5000/index.html for the main screen and point all other devices to http://your_internal_ip/join.html and follow onscreen instructions.

