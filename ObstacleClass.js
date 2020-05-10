module.exports = {
	obstacle : function(){
		this.x = 1500;
		this.width = 60;
		this.height = 60;
		this.collisionState = true;

		var colorArray = ["red","blue","black","yellow","#009688"];
		var cRandom = Math.floor((Math.random()*5)+0);
		this.color = colorArray[cRandom];
		
		var yRandom = Math.floor((Math.random()*1000)+1);
		this.y = yRandom;
	}
};
