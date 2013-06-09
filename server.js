var util = require("util");
var io = require("socket.io");

function samuelgil_server(){
	var self = this;
	self.socket = null;
	self.people = [];

	self.init = function(){
		util.log("samuelgil.es server started");
		self.socket = io.listen(8000);
	    self.socket.configure(function() {
	    	self.socket.set("transports", ["websocket","flashsocket","htmlfile", "xhr-polling", "jsonp-polling"]);
	    	self.socket.set("log level", 2);
		});
		self.socket.sockets.on("connection", self.socketConnection);
		util.log("socket.io setup and configured");

		setTimeout(function(){ self.tick(); }, 100);
	}
	self.socketConnection = function(client){
		//client is the person connected, we are now attaching events for when the client emits messages:

		util.log("sending setup data:");
		self.socket.sockets.socket(client.id).emit("setup", self.people);

		util.log("New played logged on: " + client.id);
		var oClient = new person();
		oClient.id = client.id;
		self.people.push(oClient);

		client.broadcast.emit("newplayer", oClient);

		if(!oClient){
			util.log("couldn't find player");
			self.socket.sockets.socket(client.id).emit("error", "An error occured whilst logging you in. Please try again later.");
		}
		else{
			util.log("welcome player to server");
			self.socket.sockets.socket(client.id).emit("welcome", oClient);
		}

		self.socket.sockets.socket(client.id).emit("hello", "world");
		client.on("disconnect", self.onPlayerDisconnect);
		client.on("sync", self.playerSync);
	}
	self.addPlayer = function(){
		self.people.push(new person());
	}
	self.onPlayerDisconnect = function(){
		
		util.log("Player disconnected:" + this.id);
		var removePlayer = self.getPlayer(this.id);

		if (!removePlayer) {
		    util.log("Player not found: "+this.id);
		    return;
		};

		self.people.splice(self.people.indexOf(removePlayer), 1);
		this.broadcast.emit("remove", {id: this.id});

	}
	self.playerSync = function(data){

		var iPosInIndex = self.getPlayerIndex(this.id);

		self.people[iPosInIndex].position = data.position;
		self.people[iPosInIndex].speed = data.speed;

	}
	self.tick = function(){

		//Code for calculation of each server broadcast inside here:

		var iNumberOfPlayers = self.people.length;
		var oCurrentPlayer = null;
		for (var i = 0; i < iNumberOfPlayers; i++) {
			self.people[i].tick();
		}

		self.socket.sockets.emit("tick", self.people);
		setTimeout(function(){ self.tick(); }, 100);
	}
	self.getPlayer = function(clientID){
		
		var i;
		for (i = 0; i < self.people.length; i++) {
		if (self.people[i].id == clientID)
			return self.people[i];
		};

		return false;

	}
	self.getPlayerIndex = function(clientID){
		
		var i;
		for (i = 0; i < self.people.length; i++) {
		if (self.people[i].id == clientID)
			return i;
		};

		return false;

	}

	self.init();
}
function person(){

	var self = this;
	self.id = "";
	self.position = {
		x: 0,
		y: 0
	}
	self.speed = {
		x: 0,
		y: 0
	}
	self.configuration = {
		head: 0,
		body: 0,
		feet: 0
	}
	self.init = function(){		
		//Randomise configuration so that the person is fairly unique looking:
		self.configuration.head = Math.floor(Math.random()*4);
		self.configuration.body = Math.floor(Math.random()*4);
		self.configuration.feet = Math.floor(Math.random()*4);

	}
	self.speak = function(message){

	}
	self.tick = function(){
		self.position.x = self.position.x + 1;
	}

	self.init();

}

samuelgil = new samuelgil_server();