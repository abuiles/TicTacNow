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
now.mark = null;

/*
  Function that creates an empty triqui table.
 */
makeTable = function(name){
    html = "<h2>Triqui</h2>";
    html += "<h3>Oponente: " + name + "</h3>";
    html += "<table id=triquiTable>";
    html += "<tr><td id = '1'></td><td id = '2'></td><td id = '3'></td></tr>";
    html += "<tr><td id = '4'></td><td id = '5'></td><td id = '6'></td></tr>";
    html += "<tr><td id = '7'></td><td id = '8'></td><td id = '9'></td></tr>";
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
    now.mark = 'X';
    console.log("Playing against " + player.now.name);
    makeTable(player.now.name);

}
/*
  Function called when someone makes a move
  against you.
 */
now.playClient = function(opponent, moveId){
    console.log(opponent.now.name + " made a move " + " in " + moveId);
    $("#" + moveId).html(opponent.now.mark);
    now.turn = true;
}

now.beginGame = function(playerId, canPlay){
  name = $("#" + playerId).text();
  if(canPlay){
    now.opponent = playerId;
    now.mark = 'O';
    now.playing = true;
    console.log("Start playing with " + name);
    makeTable(name);
    now.startPlay(playerId);
  }else{
    alert(name + ' está en medio de otro juego');
  }
}
// var plus2 = (function (a) { return function (b) {return a + b;} }) ( 2 )



/*
  Function called when a player name is clicked
 */
$(".player").live("click", function(){
  now.canPlay(this.id, now.beginGame);
});

/*
  Function called when someone click an element on the triqui table
 */
$("#triqui td").live("click", function(){
    if(now.turn){
      var selector = "#" + this.id;
      if( $(selector).html().length == 0 ){
        $(selector).html(now.mark);
        now.turn = false;
        now.playServer(now.opponent, this.id);
      }
    }
    else{
	alert("No es tu turno");
    }
});