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

    socket.on('addPlayer', function(playerName){
         var newPlayer = new playersClass.player(getColor(),socket.id,playerName);

        socket.emit('newClientConnect',newPlayer);

        playerArray.push(newPlayer);
        playerCount+=1;
        
        console.log(playerArray);
        if(intervalBoolean){

            sendDataInterval = setInterval(sendPlayerAndObstacleData,5);
            addObstacleInterval = setInterval(addObstacle,200);

            intervalBoolean = false;
            console.log("interval Started");
        }

    });

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

    socket.on('restartGame', function(socketId){
        playerArray.forEach(function(player){
            if(player.socketId == socketId){
              player.state = true;
              player.score = 0;
              player.x = 0;
              player.y = 0;
            }
        });

    });
    
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

function getColor(){
  var colorArray = ["red","blue","black","yellow","#009688"];
  var cRandom = Math.floor((Math.random()*5)+0);
  var color = colorArray[cRandom];

  return color;
}




function removePlayer(disconnectedSocketId){
  
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
  playerCount-=1;
  if(playerArray.length == 0){
    intervalBoolean = true;
    console.log("Intervals clear.")
    clearInterval(addObstacleInterval);
    clearInterval(sendDataInterval);
  }
}

function updateObstacles(){
  for(var i=0;i<obstacleArray.length;i++){
      checkCollision(obstacleArray[i]);
      if(!(obstacleArray[i].collisionState )|| obstacleArray[i].x < 48){
          obstacleArray.splice(i,1);
      }
      if(obstacleArray[i] != null)
        obstacleArray[i].x-=4;      
    }
}

function checkCollision(obstacle){

  playerArray.forEach(function(player){
      if(obstacle.collisionState && obstacle.x <= player.x && player.state){
        var obstacleLeft = obstacle.x;
        var obstacleRight = obstacle.x+obstacle.width;
        var obstacleTop = obstacle.y;
        var obstacleBottom = obstacle.y+obstacle.height;
        var playerLeft = player.x;
        var playerRight = player.x+player.width;
        var playerTop = player.y;
        var playerBottom = player.y+player.height;

        if(playerRight > obstacleLeft && obstacleRight > playerLeft && ((playerTop <= obstacleBottom && playerTop >= obstacleTop)||(playerBottom >= obstacleTop && playerBottom <= obstacleBottom))){
          
          obstacle.collisionState = false;
          if(obstacle.color == player.color){
            player.score+=1;
            player.color = getColor();
          }
          else{
            disablePlayer(player);
          }
        }
      }

  });
  
}

function disablePlayer(player){
  player.state = false;
  checkAndClearIntervals();
  io.sockets.emit('disableInterval', player.socketId);
}


function addObstacle(){
  var newObstacle = new obstacleClass.obstacle();
  obstacleArray.push(newObstacle);
} 