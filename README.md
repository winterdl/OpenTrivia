# OpenTrivia
Small multiplayer quiz demo using express and socket.io. [Click Here](https://alingam-quizdemo.herokuapp.com/) to view the live demo. 

Note: Using Free tier of Heroku cloud hosting for the node.js app so if the demo is offline then it has probably run out of free hours for the month so try again later.
### Current Status:
Some bugs exist but able to complete a full game.

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

