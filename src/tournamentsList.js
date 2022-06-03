import * as classes from "./classes.js"
import * as helpers from "./helpers.js"

// Demos 
import demoStandard from '../data/tournaments/demos/demoStandard.json' assert {type: 'json'}; 
import demoTieable from '../data/tournaments/demos/demoTieable.json' assert {type: 'json'}; 
import demoTiebreakers from '../data/tournaments/demos/demoTiebreakers.json' assert {type: 'json'}; 

// Dota 2 Tournaments
import dpcDiv1CN from '../data/tournaments/dota2/dota2_div1_cn.json' assert {type: 'json'}; 
import dpcDiv1EEU from '../data/tournaments/dota2/dota2_div1_eeu.json' assert {type: 'json'}; 
import dpcDiv1NA from '../data/tournaments/dota2/dota2_div1_na.json' assert {type: 'json'}; 
import dpcDiv1SA from '../data/tournaments/dota2/dota2_div1_sa.json' assert {type: 'json'}; 
import dpcDiv1SEA from '../data/tournaments/dota2/dota2_div1_sea.json' assert {type: 'json'}; 
import dpcDiv1WEU from '../data/tournaments/dota2/dota2_div1_weu.json' assert {type: 'json'}; 

// Color Schemes
import colorScheme_4team_top2Buttom2 from '../data/colorSchemes/colorScheme_4team_top2Bottom2.json' assert {type: 'json'}; 
import colorScheme_8team_top2Buttom2 from '../data/colorSchemes/colorScheme_8team_top2Bottom2.json' assert {type: 'json'}; 
import colorScheme_8team_top3Buttom2 from '../data/colorSchemes/colorScheme_8team_top3Bottom2.json' assert {type: 'json'}; 
import colorScheme_8team_top4Buttom2 from '../data/colorSchemes/colorScheme_8team_top4Bottom2.json' assert {type: 'json'}; 

let demos = [];
let tournaments = [];

const loadTournaments = () => {
	// Create each tournament
	tournaments.push(createTournament(dpcDiv1CN, colorScheme_8team_top3Buttom2));
	tournaments.push(createTournament(dpcDiv1EEU, colorScheme_8team_top3Buttom2));
	tournaments.push(createTournament(dpcDiv1NA, colorScheme_8team_top2Buttom2));
	tournaments.push(createTournament(dpcDiv1SA, colorScheme_8team_top2Buttom2));
	tournaments.push(createTournament(dpcDiv1SEA, colorScheme_8team_top2Buttom2));
	tournaments.push(createTournament(dpcDiv1WEU, colorScheme_8team_top4Buttom2));

	// Create the tournament dropdown
	let tournamentDropdownParent = document.querySelector("#tournamentDropdown");
	for(let i = 0; i < tournaments.length; i++) {
		let id = "TOURNAMENT" + i;
		let demoTournamentListItem = helpers.createTournamentDropdown(id, tournaments[i].tabName, false);
    tournamentDropdownParent.appendChild(demoTournamentListItem);
	}
}

const createTournament = (tournamentJSONData, colorSchemeJSONData) => {
	const newTournamentJSON = tournamentJSONData;

	// Create the tournament
	let newTournament = new classes.Tournament(
		newTournamentJSON.name, 
		newTournamentJSON.tabName,
		newTournamentJSON.source,
		newTournamentJSON.hasTieMatches,
		newTournamentJSON.isComplete,
		colorSchemeJSONData
	);

	// Add the teams
	for(let i = 0; i < newTournamentJSON.teams.length; i++) {
		let newTeam = new classes.Team(
			newTournamentJSON.teams[i].name,
			newTournamentJSON.teams[i].abbrev,
			newTournamentJSON.teams[i].wins,
			newTournamentJSON.teams[i].draws,
			newTournamentJSON.teams[i].losses,
			newTournamentJSON.teams[i].tiebreakerWins);
		newTournament.addTeam(newTeam);
	}

	// Add matches
	for(let i = 0; i < newTournamentJSON.matches.length; i++) {
		// Get the actual team objects 
		let team1 = newTournament.findTeamByName(newTournamentJSON.matches[i].team1);
		let team2 = newTournament.findTeamByName(newTournamentJSON.matches[i].team2);
		// Create the series
		let newSeries = new classes.Series(
			newTournamentJSON.matches[i].date,
			team1,
			team2,
			newTournamentJSON.matches[i].isTiebreaker);
		newTournament.addSeries(newSeries);
	}

	return newTournament;
}

const loadDemos = () => {
	// load demo tournaments
	demos.push(createTournament(demoStandard, colorScheme_4team_top2Buttom2));
	demos.push(createTournament(demoTieable, colorScheme_4team_top2Buttom2));
	demos.push(createTournament(demoTiebreakers, colorScheme_4team_top2Buttom2));

	// Create demo dropdown
	let demoDropdownParent = document.querySelector("#demoDropdown");
	for(let i = 0; i < demos.length; i++) {
		let id = "DEMO" + i;
		let demoTournamentListItem = helpers.createTournamentDropdown(id, demos[i].tabName, false);
    demoDropdownParent.appendChild(demoTournamentListItem);
	}
}

export { tournaments, demos, loadTournaments, loadDemos }