	
var socket;
var teal;
var obstacles = [];
var temp;
var hit;
var timeCount=0;
var score=0;
var control;
var newobstacles;
var interval;
var scoreInterval;


var canvas = document.getElementById('canvas');
var navigation = document.getElementById('navigation');
var dataReciever = document.getElementById('dataReciever');

var ctx = canvas.getContext("2d");
var ntx = navigation.getContext("2d");
var width = window.innerWidth;

var windowHeight = window.innerHeight;
windowHeight = windowHeight;
canvas.style.height = windowHeight*70/100+"px";
navigation.style.height = windowHeight*20/100 +"px";
navigation.style.marginLeft = width/3+"px";
var obstacleHeight = windowHeight*3/100;
var h = parseInt(canvas.style.height,10);
console.log(canvas.style.height);
console.log(h);
document.getElementById('restart').style.left = width/2.5+"px";
	
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            teal.left()
            break;
        case 38:
            teal.up()
            break;
        case 39:
            teal.right()
            break;
        case 40:
            teal.down()
            break;
    }
};

document.onkeyup = function(){teal.clear();};

	navigation.addEventListener('touchmove', function (e) {
			//var touch = e.originalEvent.touches[0];
			//var x = event.targetTouches[0].pageX - navigation.offsetLeft;
			//var x = e.touches[0].pageX-20;
			var y = e.targetTouches[0].pageY - navigation.offsetTop;
			//y=y-413;
			
			teal.clear();
			if(y<control.y)
				teal.up();
			else if(y>control.y)
				teal.down();
		
			control.y = y;
			control.add();
});

navigation.addEventListener('touchend',function(){
	teal.clear();
	control.x = 40;
	control.y = 35;
});

function component(width, height, color, x, y) {
	this.speedX = 0;
	this.speedY = 0;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.color = color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    this.move = function(){
    	this.x += this.speedX;
    	this.y += this.speedY;
    	ctx.fillStyle = this.color;
    	ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    this.right = function(){
    	this.speedX+=1.5;
    }
    this.left = function(){
    	this.speedX-=1.5;
    }
    this.up = function(){
    	this.speedY-=1.5;
    }
    this.down = function(){
    	this.speedY+=1.5;
    }
    this.clear = function(){
    	teal.speedY =0;
    	teal.speedX =0;
    }
}

function obstacle(height){
	this.x = width;
	var color = ["red","blue","black","yellow","#009688"];
	var cRandom = Math.floor((Math.random()*5)+0);
	this.color = color[cRandom];
	var yRandom = Math.floor((Math.random()*windowHeight)+1);
	this.y = yRandom;
	this.width = 40;
	this.height = height;
	ctx.fillStyle = color[cRandom];
	ctx.fillRect(400,yRandom,40,20);
	this.refresh = function(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}
}

	function controler(width,height,x,y){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		ntx.fillStyle = "black";
		ntx.fillRect(x,y,width,height);
		this.add = function(){
			ntx.fillStyle = "black";
			ntx.fillRect(this.x-5,this.y-5,this.width,this.height);
		}
	}	


function check(ob1){
	var obLeft = ob1.x;
	var obRight = ob1.x+ob1.width;
	var obTop = ob1.y;
	var obBottom = ob1.y+ob1.height;
	var tealLeft = teal.x;
	var tealRight = teal.x+teal.width;
	var tealTop = teal.y;
	var tealBottom = teal.y+teal.height;
	
	if(tealRight > obLeft && obRight > tealLeft && ((tealTop <= obBottom && tealTop >= obTop)||(tealBottom >= obTop && tealBottom <= obBottom))){
		reset(ob1);
	}
}



function add(){
	socket = io.connect("http://localhost:3000");
	socket.on('broadcast',
		function(data){
			
			console.log("recieved data is"+data);
		}
	);
	update();
	obstacleFunction();
	scoreFunction();
	ctx.clearRect(0,0,400,400);
	ntx.clearRect(0,0,80,80);
	control = new controler(10,10,40,40);
	teal = new component(20,obstacleHeight,"black",20,150);
}

function reset(ob1){
	var obColor = ob1.color;
	var tealColor = teal.color;
	temp = obstacles.indexOf(ob1);
	if(temp != hit){
		//alert("Crash");
		if(obColor == tealColor){
			score++;
			obstacles.splice(temp,1);
		}			
		else{
			clearInterval(interval);
			clearInterval(newobstacles);
			clearInterval(scoreInterval);
			ctx.fillStyle = "black";
			ctx.font = "20px sans-serif";
			ctx.fillText("GAME OVER",100,200);
			document.getElementById("restart").style.display = "block";
		}	
		hit = temp;
	}
}
function obstacleFunction(){
	newobstacles = setInterval(function adding(){
		obstacles.push(new obstacle(obstacleHeight));
	},1000/10);
}	
function update(){
	interval = setInterval(function update(){
		ctx.clearRect(0,0,400,400);
		ntx.clearRect(0,0,80,80);
		control.add();
		if(teal.y<0){
			teal.y=0;
		}
		if(teal.y+obstacleHeight>=300){
			teal.y = 300-obstacleHeight;
		}
		teal.move();
		ctx.fillStyle = "black";
		ctx.font = width/20+"px Courier New";
		ctx.fillText(score,10,50);
		ctx.fillText("Time:"+timeCount,200,50);
		
		for(var i=0;i<obstacles.length;i++){
			if(obstacles[i].x<-30)
				continue;
			obstacles[i].x-=2;
			obstacles[i].refresh();
			check(obstacles[i]);			
		}
		var data = {
			tealX : teal.x,
			tealY : teal.y	
		};
		socket.emit('send', data);
	},7);
}	
function scoreFunction(){
	scoreInterval = setInterval(function time(){
		timeCount+=1;
	},1000);	
}	
function restart(){
	document.getElementById("restart").style.display = "none";
	score = 0;
	timeCount = 0;
	obstacles.length = 0;
	update();
	obstacleFunction();
	scoreFunction();
}