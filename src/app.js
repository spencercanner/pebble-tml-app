/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

//http://hfboards.hockeysfuture.com/showthread.php?p=79594853

var UI = require('ui');
var Vector2 = require('vector2');
var Vibe = require('ui/vibe');
var response;
var positions;
var items = [];
var games = [];
var players;
var schedule;

var main = new UI.Menu({
	sections: [{title: 'TML'}, {
      items: [
				{title: 'View Team Roster'},
				{title: 'View Schedule'}]
    }]
});

main.on('select', function(e) {
	var index = e.itemIndex;
	console.log(index);
	switch(index){
		case (0):
			showRoster();
			break;
		case (1):
			showSchedule();
			break;
	}
});

main.show();


function showRoster() {
	var ajax = require('ajax');
	ajax({ url: 'http://nhlwc.cdnak.neulion.com/fs1/nhl/league/teamroster/TOR/iphone/clubroster.json', type: 'json' },
  function(data) {
    response = data; 
		console.log(response.toString());
		positions = new UI.Menu ( {
			sections: [{
				items: [{
					title: "Goalies"
				}, {
					title: "Defensemen"
				}, {
					title: "Forwards"
				}]
			}]
		});
		positions.on('select', function(e) {
			var index = e.itemIndex;
			items = [];
			console.log(index);
			var i;
			switch(index){
				case (0):
					for (i = 0; i < response.goalie.length; i++) {
						console.log(response.goalie[i].name);
						items.push({title: response.goalie[i].name});
					}
					break;
				case (1):
					for (i = 0; i < response.defensemen.length; i++) {
						console.log(response.defensemen[i].name);
						items.push({title: response.defensemen[i].name});
					}					
					break;
				case (2):
					for (i = 0; i < response.forwards.length; i++) {
						console.log(response.forwards[i].name);
						items.push({title: response.forwards[i].name});
					}					
					break;
			}
			players = new UI.Menu({
			sections: [{
				items: items
			}]
	});
	players.show();
			players.on('select', function (e) {
				console.log(e.item.title);
				var first;
				var last;
				if(e.item.title.split(" ").length === 2){
					first = e.item.title.split(" ")[0];
					last = e.item.title.split(" ")[1];
					showTwoNamePlayer(first, last);
				}
				else if(e.item.title.split(" ").length === 3) {
					first = e.item.title.split(" ")[0];
					var middle = e.item.title.split(" ")[1];
					last = e.item.title.split(" ")[2];
					showThreeNamePlayer(first, middle, last);
				}
			});
	});
		positions.show();
  },  // End of success callback

  function(error) {
			Vibe.vibrate('long');
	}   // End of error callback
);
}

function showTwoNamePlayer(first, last) {
	console.log(first + "#" + last);
	var ajax = require('ajax');
	ajax({ url: 'http://www.tsn.ca/mobile/bbcard.aspx?hub=NHL&name=' + first + '+' + last},
  function(data) {
		if (data !== ""){
			console.log(data.toString());
			var body = data.toString().match(/<playerCard>(.*?)<\/playerCard>/g).toString().replace('<playerCard>','').replace('</playerCard>','');
			var name = body.match(/<playerCardName>(.*?)<\/playerCardName>/g).toString().replace('<playerCardName>','').replace('</playerCardName>','');
			var info = body.match(/<playerCard-info>(.*?)<\/playerCard-info>/g).toString().replace('<playerCard-info>','').replace('</playerCard-info>','');
			var status = body.match(/<playerCard-status>(.*?)<\/playerCard-status>/g).toString().replace('<playerCard-status>','').replace('</playerCard-status>','');
			var headers = body.match(/<headers (.*?)<\/headers>/g).toString().replace('<headers ','').replace('>headers</headers>','');
			var rowsData = body.match(/<playerCard-row (.*?)<\/playerCard-row>/g);
			console.log(body);
			console.log(name);
			console.log(info);
			console.log(headers.split('\" col'));
			var playerData = "";
			var headerArr = headers.split('\" col');
			if (rowsData === null) {
				playerData += status.split(",")[0];
			}
			else {
				for (var i = 1; i < headerArr.length; i++){
					var rowArr = rowsData[0].toString().replace('<playerCard-row ','').replace('>info</playerCard-row>','').split('\" col');
					var tag = headerArr[i].split('\"');
					var value = rowArr[i].split('\"');
					playerData += tag[1] + ": " + value[1] + "\n";
					console.log(tag[1] + ":" + value[1]);
				}
			}
			var card = new UI.Card({
				title: first + ' ' + last,
				body: playerData,
				scrollable: true
			});
			card.show();
		}
		else {
			var noPlayer = new UI.Card({
				title: first + ' ' + last,
				body: "Sorry, no data available for this player",
				scrollable: true
			});
			noPlayer.show();
		}
	});
}

function showThreeNamePlayer(first, middle, last) {
	console.log(first + "#" + middle + "#" + last);
	var ajax = require('ajax');
	ajax({ url: 'http://www.tsn.ca/mobile/bbcard.aspx?hub=NHL&name=' + first + '+' + middle + '+' + last},
  function(data) {
		if(data !== null){
			console.log(data.toString());
			var body = data.toString().match(/<playerCard>(.*?)<\/playerCard>/g).toString().replace('<playerCard>','').replace('</playerCard>','');
			var name = body.match(/<playerCardName>(.*?)<\/playerCardName>/g).toString().replace('<playerCardName>','').replace('</playerCardName>','');
			var info = body.match(/<playerCard-info>(.*?)<\/playerCard-info>/g).toString().replace('<playerCard-info>','').replace('</playerCard-info>','');
			var status = body.match(/<playerCard-status>(.*?)<\/playerCard-status>/g).toString().replace('<playerCard-status>','').replace('</playerCard-status>','');
			var headers = body.match(/<headers (.*?)<\/headers>/g).toString().replace('<headers ','').replace('>headers</headers>','');
			var rows = body.match(/<playerCard-row (.*?)<\/playerCard-row>/g)[0].toString().replace('<playerCard-row ','').replace('>info</playerCard-row>','');
			console.log(body);
			console.log(name);
			console.log(info);
			console.log(headers.split('\" col'));
			var playerData = "";
			var headerArr = headers.split('\" col');
			var rowArr = rows.split('\" col');
			if (rowArr.length === 0) {
				playerData += status.split(",")[0];
			}
			else {
				for (var i = 1; i < headerArr.length; i++){
					var tag = headerArr[i].split('\"');
					var value = rowArr[i].split('\"');
					playerData += tag[1] + ": " + value[1] + "\n";
					console.log(tag[1] + ":" + value[1]);
				}
			}
			var card = new UI.Card({
				title: first + ' ' + middle + ' ' + last,
				body: playerData,
				scrollable: true
			});
			card.show();
		}	
		else {
			var noPlayer = new UI.Card({
				title: first + ' ' + last,
				body: "Sorry, no data available for this player",
				scrollable: true
			});
			noPlayer.show();
		}
	});
}


function showSchedule () {
	var ajax = require('ajax');
	var date = new Date();
	var dateNum = date.toJSON().slice(0,10);
	var dateString = date.toDateString();
	var year = dateNum.split("-")[0];
	var month = dateNum.split("-")[1];
	//var day = dateNum.split("-")[2];
	ajax({ url: 'http://nhlwc.cdnak.neulion.com/fs1/nhl/league/clubschedule/TOR/' + year + '/' +  month + '/iphone/clubschedule.json', type: 'json' },
  function(data) { 
		console.log(data);
		var currentData = data;
		var games = [];
		var i;
		for (i = 0; i < currentData.games.length; i++){
			var game = currentData.games[i];
			var loc = game.loc;
			var opp = game.abb;
			var score = game.score;
			var start = game.startTime;
			var date = start.split(" ")[0].split("/");
			var time = start.split(" ")[1].split(":");
			console.log(date[1]);
			var d = new Date(date[0], date[1] - 1, date[2]);
			console.log(d);
			var newTime;
			if(time[0] > 12) {
				var hour = time[0] - 12;
				newTime = hour + ":" + time[1] + " PM";
			}
			else 
				newTime = time[0] + ":" + time[1] + " AM";
			var status = game.status;
			var period = game.cPeriod;
			var title;
			var subtitle;
			if (loc == "home")
				title = "Home vs " + opp;
			else 
				title = "Away vs " + opp;
			if (period === ""){
				subtitle = d.toDateString().substring(4,d.toDateString().length-5) + " - " +  newTime;
			}
			else {
				if(status == "FINAL"){
					subtitle = score + " - " + d.toDateString().substring(4,d.toDateString().length-5);
				}
				else {
					subtitle = period + " period " + score; 
				}
			}
			games.push({title: title, subtitle: subtitle});
		}
		schedule = new UI.Menu ({
			sections: [{
				items: games
			}]
		});
		schedule.show();
	},
	function(error) {
		Vibe.vibrate('long');
	});
}




