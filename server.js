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
		self.addPlayer();
	}
	self.socketConnection = function(client){
		//client is the person connected, we are now attaching events for when the client emits messages:
		util.log("New played logged on: " + client.id);
		//client.on("sayhello", onNewPlayer);
	}
	self.addPlayer = function(){
		self.people.push(new person());
	}

	self.init();
}
function person(){

	var self = this;
	self.id = "";
	self.position = {
		x: 0,
		y: 0
	};
	self.configuration = {
		head: 0,
		body: 0,
		feet: 0
	}
	self.init = function(){		
		//Randomise configuration so that the person is fairly unique looking:

	}
	self.speak = function(message){

	}

	self.init();

}

samuelgil = new samuelgil_server();