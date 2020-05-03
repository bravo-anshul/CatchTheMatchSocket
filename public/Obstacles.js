class Obstacle{
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