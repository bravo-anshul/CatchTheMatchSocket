module.exports = {
	player : function(color,playerId,socketId,socketObject){
		this.x = 0;
		this.y = 0;
		this.color = color;
		this.playerId = playerId;
		this.socketId = socketId;
		this.socketObject = socketObject;
	}
};
