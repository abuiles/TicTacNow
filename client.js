/*
  When a succesful connection is made to the server we
  just call the test function to see if everything is
  working, then we inform the server of our name.
 */

var FINISHED     = 1;
var NOT_FINISHED = 0;
var TIE          = 2;

now.ready(function(){
    now.getServerInfo(function(res){
	console.log(res);
    });
    now.setName(); //Tells the server we chose a name
});


now.turn = false;
now.playing = false;
now.name = prompt("Ingresa tu nombre");
now.opponent = null;
now.mark = null;

/*
  Function that creates an empty triqui table.
 */
makeTable = function(name){
    html = "<h2>Triqui</h2>";
    html += "<h3>Oponente: " + name + "</h3>";
    html += "<table id='triquiTable'>";
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

now.notifyTie = function(opponent){
  // $("#triqui td").die();
  $('#notification').html('<h1>Es un empate! Haga click aquí para terminar</h1>');
  $('#notification').click(function(){
    $('#notification').html('');
    now.opponent = -1;
    now.mark = -1;
    now.playing = false;
    now.turn = false;
    $("#triqui").html('No estás jugando todavía');
    // $("#triqui td").die();
  });
}
// var plus2 = (function (a) { return function (b) {return a + b;} }) ( 2 )

var FINISHED_POSITIONS = [ [1, 2, 3],
                           [4, 5, 6],
                           [7, 8, 9],
                           [1, 4, 7],
                           [2, 5, 8],
                           [3, 6, 9],
                           [1, 5, 9],
                           [3, 5, 7] ]

function checkBoard(){

  var getMark = function (position){
    var selector = "#" + position;
    return $(selector).html();
  }

  for ( i in FINISHED_POSITIONS ){
    var pos = FINISHED_POSITIONS[i];
    if( getMark(pos[2]).length > 0 && getMark(pos[0]) == getMark(pos[1]) &&  getMark(pos[1]) == getMark(pos[2]) ){
      return FINISHED;
    }
  }
  for ( i in FINISHED_POSITIONS ){
    var pos = FINISHED_POSITIONS[i];
    for( j in pos ){
      if (getMark( pos[j] ).length == 0){
        return NOT_FINISHED;
      }
    }
  }
  return TIE;
}

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
        gameStatus = checkBoard(this.id);
        now.playServer(now.opponent, this.id);
        if( gameStatus == FINISHED ){
          now.finishedGame(now.opponent);
        }else if ( gameStatus == TIE ){
          now.tieGame(now.opponent);
        }
      }
    }
    else{
	alert("No es tu turno");
    }
});