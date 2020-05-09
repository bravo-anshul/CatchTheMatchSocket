function PlayerObject(color,socketId){
	
	this.speedX = 0;
	this.speedY = 0;
	this.width = 30;
	this.height = 30;
	this.x = 20;
	this.y = 50;    
	this.color = color;
	this.socketId = socketId;
	
	
	this.move = function(){
		 this.x += this.speedX;
		 this.y += this.speedY;
	}

	this.right = function(){
		if(this.speedX < 4.5)
		 this.speedX+=4.5;  	
	}  
	this.left = function(){  	
		if(this.speedX > -4.5)
			this.speedX-=4.5;
	}
	this.up = function(){
		if(this.speedY > -4.5)
	   		this.speedY-=4.5;
	}
	this.down = function(){
		if(this.speedY < 4.5)
	    	this.speedY+=4.5;
	}
	this.clear = function(){
		this.speedY =0;
	    this.speedX =0;
	}
}