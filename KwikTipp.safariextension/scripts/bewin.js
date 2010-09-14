
var bewinUrl = "https://www.bwin.com/de/betviewiframe.aspx?sorting=leaguedate&categoryIDs=192&selectedLeagues=1&show=favourites";

var bewin = {
	load: function() {
		$.get(bewinUrl, function(data) {
			bewin.data($(data));
		});		
	},
	
	data: function($dom) {
		var $games = $("tr.def h4", $dom);
		var data = [];
		$.each($games, function() {
		    var game = {};
		    var game_data = $(this).text().trim().split(" - ");
		    game.host = game_data[0];
		    game.guest = game_data[1];
		    game.time = game_data[2];
		    game.odds = {};
		    var $headline = $(this).closest("tr.def");
		    var $complete = $headline.nextAll("tr.def").eq(1);
		    var $rows = $complete.nextUntil("tr.normal + tr.def, tr.normal + tr.bottomline");

		    $.each($rows.find("table.item"), function() {
		        var label = $(this).find("td.label").text().trim();
		        var odd = $(this).find("td.odd").text().trim();
		        game.odds[label] = odd;
		    });

		    data.push(game);
		});		
		localStorage["bewin.data"] = JSON.stringify(data);
		localStorage["bewin.last_update"] = new Date().getTime();
	}
}
bewin.load();