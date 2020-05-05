var playersClass = require('./PlayersClass.js');
var obstacleClass = require('./ObstacleClass.js');

var express = require('express');

var app = express();
app.use(express.static('public'));

var server = app.listen(3000);
var io = require('socket.io')(server);

console.log("server running");

var playerCount=0;
var playerArray = [];
var obstacleArray = [];
var colorArray = ["black","blue","red","green"];

var intervalBoolean = true;


io.sockets.on('connection',

  function (socket) {
    console.log("We have a new client: " + socket.id);

    var newPlayer = new playersClass.player(colorArray[playerCount],socket.id);

    socket.emit('newClientConnect',newPlayer);

    playerArray.push(newPlayer);
    playerCount+=1;
    obstacleFunction();
    console.log(playerArray);
    if(intervalBoolean){
        setInterval(sendPlayerAndObstacleData,10);
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
        /*sendPlayer();
        sendObstacles();*/
      }
    );

    socket.on('socketConnected', 
      function(){
        
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

/*function sendPlayer(){
  io.sockets.emit('recievePlayer', playerArray,obstaclesArray);
}

function sendObstacles(){
  updateObstacles();
  io.sockets.emit('recieveObstacles', obstaclesArray);
}
*/
function removePlayer(disconnectedSocketId){
  playerCount-=1;
  for(var index=0;index<playerArray.length;index++){
      if(playerArray[index].socketId == disconnectedSocketId){
          playerArray.splice(index,1);
          break;
     }
  }

  console.log(playerArray);
}

function updateObstacles(){
  for(var i=0;i<obstacleArray.length;i++){
      if(obstacleArray[i].x<-30)
          obstacleArray.splice(i,1);
      obstacleArray[i].x-=2;
      
      //check(obstacles[i]);      
    }
}

function obstacleFunction(){
  newobstacles = setInterval(function adding(){
    var newObstacle = new obstacleClass.obstacle();
    obstacleArray.push(newObstacle);
  },300);
} 