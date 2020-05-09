var playersClass = require('./PlayersClass.js');
var obstacleClass = require('./ObstacleClass.js');

var express = require('express');

var app = express();
app.use(express.static('public'));
var port = process.env.PORT || 3000;

var server = app.listen(port);
var io = require('socket.io')(server);

console.log("server running");

var playerCount=0;
var playerArray = [];
var obstacleArray = [];
var colorArray = ["black","blue","red","green"];

var intervalBoolean = true;
var sendDataInterval;
var addObstacleInterval;


io.sockets.on('connection',

  function (socket) {
    console.log("We have a new client: " + socket.id);

    var newPlayer = new playersClass.player(colorArray[playerCount],socket.id);

    socket.emit('newClientConnect',newPlayer);

    playerArray.push(newPlayer);
    playerCount+=1;
    
    console.log(playerArray);
    if(intervalBoolean){

        sendDataInterval = setInterval(sendPlayerAndObstacleData,5);
        addObstacleInterval = setInterval(addObstacle,500);

        intervalBoolean = false;
        console.log("interval Started");
    }
  
    socket.on('send',
      function(playerData) {
        playerArray.forEach(function(item){
            if(item.socketId == playerData.socketId){
                item.x = playerData.x;
                item.y = playerData.y;
            }

        });
      }
    );
    
    socket.on('disconnect', function() {
      console.log("Client Disconnected :" + socket.id);
      removePlayer(socket.id);
    });

  }
);

function sendPlayerAndObstacleData(){
  updateObstacles();
  io.sockets.emit('recieveData', {playerData : playerArray, obstacleData : obstacleArray})
}


function removePlayer(disconnectedSocketId){
  playerCount-=1;
  for(var index=0;index<playerArray.length;index++){
      if(playerArray[index].socketId == disconnectedSocketId){
          playerArray.splice(index,1);
          break;
     }
  }

  checkAndClearIntervals();
  
  console.log(playerArray);
}

function checkAndClearIntervals(){
  if(playerArray.lenght == 0){
    clearInterval(addObstacleInterval);
    clearInterval(sendDataInterval);
  }
}

function updateObstacles(){
  for(var i=0;i<obstacleArray.length;i++){
      if(obstacleArray[i].x<-30)
          obstacleArray.splice(i,1);
      obstacleArray[i].x-=2;
      
      //check(obstacles[i]);      
    }
}

function addObstacle(){
  var newObstacle = new obstacleClass.obstacle();
  obstacleArray.push(newObstacle);
} 