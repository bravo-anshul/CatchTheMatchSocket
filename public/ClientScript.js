var socket;

var canvas = document.getElementById('canvas');
var playerObject; // External PlayerObject File

var canvasContext;


var windowHeight;
var windowWidth;

var playerData;
var obstaclesArray = [];

function initialize(){

	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;

	canvasContext = setupCanvas(canvas);
	
	connectSocket();
	
}

function setupCanvas(canvas) {

  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();

  canvas.width = (windowWidth-20) * dpr;
  canvas.height = (windowHeight-40) * dpr;
  var ctx = canvas.getContext('2d');

  ctx.scale(dpr, dpr);
  return ctx;
}


function connectSocket(){
	socket = io();
	//socket = io.connect("http://192.168.1.11:3000");

	activateEvents();
}


function activateEvents(){

	socket.on('newClientConnect',
		function(playerData){
			//console.log(playerData.color,playerData.playerId);
			playerObject = new PlayerObject(playerData.color,playerData.socketId);
			displayObject();
			setInterval(sendData,5);
		}
	);

	socket.on('recieveData',
		function(data){
			playerData = data.playerData;
			obstaclesArray = data.obstacleData;
		}
	);


}

document.onkeydown = function(e) {
    switch (e.keyCode) {
    	case 65:
        case 37:
            playerObject.left();
            break;
        case 87:
        case 38:
            playerObject.up();
            break;
        case 68:
        case 39:
            playerObject.right();
            break;
        case 83:
        case 40:
            playerObject.down();
            break;
    }
   	
};

document.onkeyup = function(e) {
    switch (e.keyCode) {
    	case 65:
        case 37:
        case 68:
        case 39:
            playerObject.clearHorizontal();
            break;
        case 87:
        case 38:
        case 83:
        case 40:
            playerObject.clearVertical();
            break;
    }
   
};

function sendData(){
	
	var data = {
		x : playerObject.x,
		y : playerObject.y,
		color : playerObject.color,
		socketId : playerObject.socketId
	};
	socket.emit('send', data);
}


function displayText(){
	canvasContext.fillStyle = "black";
	canvasContext.font = width/20+"px Courier New";
	canvasContext.fillText(1,10,50);
	canvasContext.fillText("Time:"+10,200,50);
}
function checkBoundary(){
	if(playerObject.y<0){
		playerObject.y=0;
	}
	if(playerObject.y+60>=windowHeight){
		playerObject.y = windowHeight-60;
	}
	if(playerObject.x<0){
		playerObject.x=0;
	}
	if(playerObject.x+60>=windowWidth){
		playerObject.x = windowWidth-60;
	}

}


function displayObject(){
	canvasContext.clearRect(0,0,windowWidth,windowHeight);
	//console.log(playerObject.socketId);
	playerObject.move();
	checkBoundary();
	displayObstacles();
	//displayText();
	
	if(playerData!=null){
		playerData.forEach(function(item){
			if(item.socketId == playerObject.socketId)
				return;
			canvasContext.fillStyle = item.color;
			canvasContext.fillRect(item.x,item.y,playerObject.width,playerObject.height);
		});
	}	
	window.requestAnimationFrame(displayObject);
}

function displayObstacles(){
	obstaclesArray.forEach(function(item){
			canvasContext.fillStyle = item.color;
			canvasContext.fillRect(item.x,item.y,item.width,item.height);
	});
}