var estimator;

function button(event) {
	
	var url = safari.application.activeBrowserWindow.activeTab.url;

	if(url && url.match(/kicktipp.de\/.*\/tippabgabe/)) {
		estimator = undefined;
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("scan");		
	} else {
		var group = safari.extension.settings.group;
		if(group)
			safari.application.activeBrowserWindow.activeTab.url = "http://www.kicktipp.de/"+group+"/tippabgabe";		
	}
}

function message(event) {
	if(event.name == "result_request") {
		var message = {
			host: event.message.host,
			guest: event.message.guest,
			result: estimate_result(event.message.host, event.message.guest)
		};
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("result_response", message);
		
	} else if(event.name == "pageload") {
		var parts = safari.application.activeBrowserWindow.activeTab.url.match(/kicktipp.de\/(.*)\/tippabgabe/);
		console.log(parts);
		if(parts && parts.length == 2)
			safari.extension.settings.group = parts[1];
	}
}

function estimate_result(home, guest) {
	if(estimator == undefined) {		
		switch (safari.extension.settings.algorithm) {
		  case "random":
		    estimator = new Random();
		  case "frequency":
		    estimator = new Frequency();
		    break;
		  case "tendency_odds":
		    estimator = new Mybet(mybet.data());
		    break;
		}		
	}
	return estimator.estimate(home, guest);
}

safari.application.addEventListener("command", button, false);
safari.application.activeBrowserWindow.activeTab.addEventListener("message", message, false);

var Random = Class.extend({
	estimate: function(guest, host) {
		return Math.round(Math.random()*2) + ":" + Math.round(Math.random()*2); 
	}	
});

var Frequency = Class.extend({
	history: {
		'1:1' : 72,
		'2:1' : 61,
		'1:0' : 53,
		'0:0' : 43,
		'2:0' : 42,
		'1:2' : 38,
		'0:1' : 34,
		'2:2' : 33,
		'0:2' : 29,
		'3:0' : 27,
		'1:3' : 19,
		'2:3' : 19,
		'3:1' : 18,
		'4:0' : 18,
		'0:3' : 15,
		'4:1' : 15,
		'3:2' : 12,
		'3:3' : 11,
		'4:2' : 7,
		'5:1' : 7,
		'2:4' : 6,
		'1:4' : 5,
		'1:5' : 5,
		'0:4' : 4,
		'5:2' : 3,
		'0:5' : 3,
		'2:5' : 2,
		'5:0' : 2,
		'4:3' : 2,
		'7:0' : 1,
		'6:1' : 1,
		'5:3' : 1,
		'5:4' : 1,
		'0:6' : 1,
		'4:4' : 1,
		'6:0' : 1
	},
	estimate: function(guest, home) {
		var rand = Math.round(Math.random()*this.sum()-1);
		var sum = 0;
		for(var i in this.history) {
			sum += this.history[i];
			if(sum >= rand)
				return i
		}
	},
	sum: function(options) {
		var sum = 0;
		for(var i in this.history) {
			sum += this.weight(i, options);
		}
		return sum;		
	},
	weight: function(result) {
		return this.history[result];
	},
});

var Mybet = Frequency.extend({
	init: function(odds){
		this.odds = odds;
		this.factor = 100;
	},
	estimate: function(home, guest) {
		var odds = this.findOdds(home, guest);
		if(!odds)
			console.log("no odds found for",home, guest);
		var rand = Math.round(Math.random()*this.sum(odds)-1);
		var sum = 0;
		for(var i in this.history) {
			sum += this.weight(i, odds);
			if(sum >= rand)
				return i
		}
	},
	findOdds: function(home, guest) {
		var result;
		$.each(this.odds, function() {
			if(guest == this.guest && home == this.home)
				result = this.odds;
		});
		return result;
	},
	weight: function(result, odds) {
		var frequency = this.history[result];
		
		if(!odds)
			return this._super(result);
		
		var type = this.resultType(result);
		return Math.round(frequency * this.factor / parseFloat(odds[type]));
	},
	resultType: function(result) {
		var part = result.split(":");
		var diff = parseInt(part[0]) - parseInt(part[1]);

		if(diff == 0)
			return "draw";
		else if(diff < 0)
			return "guest";
		else
			return "home";
	}
});