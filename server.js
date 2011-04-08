
var fs = require('fs');

/*
  Simpple http server.
  It just serves the index.html, client.js and triqui.css files.
 */
var server = require('http').createServer(function(req, response){
    var file = __dirname + ((req.url == "/client.js")?'/client.js':'/index.html');
    var type = (req.url == "/client.js")?'text/javascript':'text/html';
    if(req.url == "/triqui.css"){
	file = __dirname + "/triqui.css";
	type = "text/css";
    }

    fs.readFile(file, function(err, data){
	response.writeHead(200, {'Content-Type':type});
	response.write(data);
	response.end();
    });
});
server.listen(8080);

var everyone = require("now").initialize(server);

//List of players
players = []

/*
  Utility function that finds a player given its id
 */
findPlayer = function(id){
    for(i in players){
	if(players[i].user.clientId == id)
	    return players[i];
    }
    return null;
}

/*
  Function called when someone connects
 */
everyone.connected(function(){
});

/*
  When a player disconnects, erase him from the list
  And update the other clients.
 */
everyone.disconnected(function(){
    console.log(this);
    for(i in players){
	if(players[i].user.clientId == this.user.clientId){
	    console.log("Removing " + this.user.clientId);
	    players.splice(i,1);
	}
    }
    everyone.now.updatePlayers(players);
});

/*
  Function called when a player choses a name for himself
 */
everyone.now.setName = function(){
    console.log("Adding new player: ", this.now.name);
    players.push(this);
    everyone.now.updatePlayers(players);
}

/*
  Function called when a game is going to be initiated
 */
everyone.now.startPlay = function(id){
    player = findPlayer(id);
    console.log(this.now.name + " playing against " + player.now.name);
    player.now.startPlayClient(this);
}

everyone.now.canPlay = function(id, callback){
  player = findPlayer(id);
  console.log(player.now.name + " is playing: " + player.now.playing );
  if (player.now.playing){
    callback(id, false);
  }else{
    callback(id, true);
  }
}

everyone.now.tieGame = function (id){
  opponent = findPlayer(id);
  this.now.notifyTie(opponent);
  opponent.now.notifyTie(opponent);
}
/*
  Function called when the client makes a play.
 */
everyone.now.playServer = function(id, moveId){
  opponent = findPlayer(id);
  console.log(this.now.name + " made a move against " + opponent.now.name + " in " + moveId );
  opponent.now.playClient(this, moveId);
}

/*
  Test function
 */
everyone.now.getServerInfo = function(callback){
  callback("Some info here");
}

