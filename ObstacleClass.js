module.exports = {
	obstacle : function(){
		this.x = 500;
		this.width = 20;
		this.height = 20;

		var colorArray = ["red","blue","black","yellow","#009688"];
		var cRandom = Math.floor((Math.random()*5)+0);
		this.color = colorArray[cRandom];
		var yRandom = Math.floor((Math.random()*1000)+1);
		this.y = yRandom;
	}
};
