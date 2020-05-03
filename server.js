var playersClass = require('./PlayersClass.js');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = app.listen(3000);
var io = require('socket.io')(server);

console.log("server running");

var playerCount = 0;
var playerArray = [];
var colorArray = ["black","blue","red","green"];
var socketArray = [];


io.sockets.on('connection',

  function (socket) {
    console.log("We have a new client: " + socket.id);

    socketArray[playerCount] = socket;
    var newPlayer = new playersClass.player(colorArray[playerCount],playerCount,socket.id);
    playerCount+=1;

    socket.emit('newClientConnect',newPlayer);

    playerArray.push(newPlayer);
    console.log(playerArray);
  
    socket.on('send',
      function(playerData) {
        //console.log(playerData.playerId)
        //if(playerArray[playerData.playerId]!=null){
            playerArray[playerData.playerId].x = playerData.x;
            playerArray[playerData.playerId].y = playerData.y;
       // }
        sendPlayer();

      }
    );

    socket.on('socketConnected', 
      function(){
        sendPlayer();
      }
    );
    
    socket.on('disconnect', function() {
      console.log("Client Disconnected :" + socket.id);
      removePlayer(socket.id);
    });

  }
);

function removePlayer(disconnectedSocketId){
  playerCount-=1;
  console.log("inside remove player");
  var index=0;
  for(;index<playerArray.length;index++){
    console.log("inside first for");
      if(playerArray[index].socketId == disconnectedSocketId){
          console.log("inside if");
          playerArray.splice(index,1);
          break;
     }
  }
  console.log(index);
  for(;index<playerArray.length;index++){
      console.log("inside update loop");
      playerArray[index].playerId -=1;
      console.log(socketArray[index].id);
      socketArray[index].emit("decreasePlayerId");

  }

  console.log("updated player array length :"+ playerArray.length);
  console.log(playerArray);

}

function sendPlayer(){
  io.sockets.emit('recievePlayer', playerArray);
}
