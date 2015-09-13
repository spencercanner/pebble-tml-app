/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

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
		});
		positions.show();
  },  // End of success callback

  function(error) {
			Vibe.vibrate('long');
	}   // End of error callback
);
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
    for (var i = 0; i < data.games.length; i++){
			var game = data.games[i];
			var loc = game.loc;
			var opp = game.abb;
			var score = game.score;
			var start = game.startTime;
			var date = start.split(" ")[0].split("/");
			var time = start.split(" ")[1].split(":");
			var d = new Date(date[0], date[1], date[2]);
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
				subtitle = d.toDateString() + " - " +  newTime;
			}
			else {
				if(status == "FINAL"){
					subtitle = score + " - " + d.toDateString();
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
  },  // End of success callback

  function(error) {
			Vibe.vibrate('long');
	}   // End of error callback
);
}




