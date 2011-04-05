/*
  When a succesful connection is made to the server we
  just call the test function to see if everything is
  working, then we inform the server of our name.
 */
now.ready(function(){        
    now.getServerInfo(function(res){
	console.log(res);
    });
    now.setName(); //Tells the server we chose a name
});


now.turn = false;
now.playing = false;
now.name = prompt("Ingresa tu nombre");
now.oppontent = null;

/*
  Function that creates an empty triqui table.
 */
makeTable = function(name){
    html = "<h2>Triqui</h2>";
    html += "<h3>Oponente: " + name + "</h3>";
    html += "<table id=triquiTable>";
    html += "<tr><td></td><td></td><td></td></tr>";
    html += "<tr><td></td><td></td><td></td></tr>";
    html += "<tr><td></td><td></td><td></td></tr>";
    html += "</table>";
    $("#triqui").html(html);
}

/*
  Function called by the server when the player list
  needs to be updated.
*/
now.updatePlayers = function(players){
    console.log(players);
    list = $("#players");
    html = "<h2>Jugadores</h2>";
    html += "<ul>";
    for(var p in players){
	if(now.name != players[p].now.name){
	    html += "<li id="+ players[p].user.clientId;
	    html +=  " class='player'>";
	    html += players[p].now.name + "</li>";
	}
    }
    html += "</ul>";
    list.html(html);
}

/*
  Function called when somene requests a game
 */
now.startPlayClient = function(player){
    now.opponent = player.user.clientId;
    now.turn = true;
    now.playing = true;
    console.log("Playing against " + player.now.name);
    makeTable(player.now.name);
    
}
/*
  Function called when someone makes a move
  against you.
 */
now.playClient = function(opponent){
    console.log(opponent.now.name + " made a move");
    now.turn = true;
}

/*
  Function called when a player name is clicked
 */
$(".player").live("click", function(){
    now.opponent = this.id;
    name = $(this).text();
    console.log("Start playing with " + name);
    makeTable(name);
    now.startPlay(this.id);
});

/*
  Function called when someone click an element on the triqui table
 */
$("#triqui td").live("click", function(){
    if(now.turn){
	now.turn = false;
	now.playServer(now.opponent);
    }
    else{
	alert("No es tu turno");
    }
});