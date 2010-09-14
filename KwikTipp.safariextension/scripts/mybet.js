var mybet = {
	url: "http://www.mybet.com/de/sportwetten/wettprogramm/fussball/deutschland/1-bundesliga",
	
	translations: {
		"SV Werder Bremen": "Werder Bremen",
		"Mainz 05": "FSV Mainz 05",
		"Borussia Mönchengladbach": "Bor. Mönchengladbach",
		"TSG Hoffenheim": "1899 Hoffenheim"
	},
	
	data: function($dom) {
		if(!mybet.valid()) {
			mybet.load()
		};
		return JSON.parse(localStorage["mybet.data"]);
	},
	
	load: function() {
		$.get(mybet.url, function(data) {
			mybet.process($(data));
		});		
	},

	process: function($dom) {
		var $games = $("table.betEvent", $dom);
		var data = [];
		$.each($games, function() {
			var $game = $(this);
			
			var home = $game.find(".home1x2 a").attr("title");
			var guest =  $game.find(".away1x2 a").attr("title");
			
			if(mybet.translations[home])
				home = mybet.translations[home];
			if(mybet.translations[guest])
				guest = mybet.translations[guest];
			
		    data.push({
				home: home,
				guest: guest,
				odds: {
					home: $game.find(".home1x2 a").text(),
					draw: $game.find(".draw1x2 a").text(),
					guest: $game.find(".away1x2 a").text() 
				}
			});
		});		
		localStorage["mybet.data"] = JSON.stringify(data);
		localStorage["mybet.last_update"] = new Date().getTime();	
	},
	
	valid: function() {
		return localStorage["mybet.last_update"] && parseInt(localStorage["mybet.last_update"])+1000*60*60 > (new Date().getTime());
	}
}