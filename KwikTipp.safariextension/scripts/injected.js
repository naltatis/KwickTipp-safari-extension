function scan() {
	var elements = document.querySelectorAll("#tippabgabeForm table tbody tr");
	for(var i=0; i<elements.length; i++){
		var row = elements[i];
		var cells = row.children
		if(cells.length > 3) {
			safari.self.tab.dispatchMessage("result_request", {
				host: cells[2].innerHTML,
				guest: cells[3].innerHTML
			});			
		}
	}
}

function fill(host, guest, result) {
	var elements = document.querySelectorAll("#tippabgabeForm table tbody tr");
	for(var i=0; i<elements.length; i++){
		var cells = elements[i].children;
		if(cells.length > 3) {
			if(cells[2].innerHTML == host && cells[3].innerHTML == guest) {
				var inputs = elements[i].querySelectorAll(".ergebnis");
				var results = result.split(":");
				inputs[0].value = results[0];
				inputs[1].value = results[1];
				return;
			}
		}
	}
}

safari.self.addEventListener("message", function(event) {
	if(event.name == "scan")
		scan();
	if(event.name == "result_response")
		fill(event.message.host, event.message.guest, event.message.result);
}, false);