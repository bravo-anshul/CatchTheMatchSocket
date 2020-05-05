var socket;

var canvas = document.getElementById('canvas');
var playerObject; // External PlayerObject File

var canvasContext = canvas.getContext("2d");


var windowHeight;
var obstacleHeight;
var canvasHeight;
var width;
var playerData;
var obstaclesArray = [];

function initialize(){

	width = window.innerWidth;
	windowHeight = window.innerHeight;
	//canvas.style.height = windowHeight*95/100+"px";
	canvas.style.width = window.innerWidth;
	obstacleHeight = windowHeight*1/100;
	canvasHeight = parseInt(canvas.style.height,10);

	document.getElementById('restart').style.left = width/2.5+"px";
	connectSocket();
	
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
			setInterval(sendData,15);
		}
	);

	socket.on('recieveData',
		function(data){
			console.log(data.playerData);
			console.log(data.obstacleData);
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
function sendData(){
	
	var data = {
		x : playerObject.x,
		y : playerObject.y,
		color : playerObject.color,
		socketId : playerObject.socketId
	};
	socket.emit('send', data);
}
document.onkeyup = function(){playerObject.clear();};

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
	if(playerObject.y+obstacleHeight>=300){
		playerObject.y = 300-obstacleHeight;
	}
}


function displayObject(){
	canvasContext.clearRect(0,0,400,400);
	//console.log(playerObject.socketId);
	playerObject.move();
	checkBoundary();
	displayObstacles();
	//displayText();
	
	if(playerData!=null){
		playerData.forEach(function(item){
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