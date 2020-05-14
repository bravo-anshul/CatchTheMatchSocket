module.exports = {
	player : function(color,socketId, playerName){
		this.x = 0;
		this.y = 0;
		this.width = 30;
		this.height = 30;
		this.color = color;
		this.socketId = socketId;
		this.score = 0;
		this.state = true;
		this.name = playerName;
	}
};
