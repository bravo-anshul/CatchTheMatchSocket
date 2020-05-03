var playersClass = require('./PlayersClass.js');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = app.listen(3000);
var io = require('socket.io')(server);

console.log("server running");

var playerCount=0;
var playerArray = [];
var colorArray = ["black","blue","red","green"];


io.sockets.on('connection',

  function (socket) {
    console.log("We have a new client: " + socket.id);

    var newPlayer = new playersClass.player(colorArray[playerCount],socket.id);

    socket.emit('newClientConnect',newPlayer);

    playerArray.push(newPlayer);
    playerCount+=1;
    console.log(playerArray);
  
    socket.on('send',
      function(playerData) {
        playerArray.forEach(function(item){
            if(item.socketId == playerData.socketId){
                item.x = playerData.x;
                item.y = playerData.y;
            }

        });
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


function sendPlayer(){
  io.sockets.emit('recievePlayer', playerArray);
}

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

