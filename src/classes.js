class Team {
     constructor(name, abbrev, wins, losses, tieBreakerWins){
          this.place = 0;
          this.name = name;
          this.abbrev = abbrev;
          this.wins = wins;
          this.losses = losses;
          this.tieBreakerWins = tieBreakerWins;
          this.isTied = false;
     }
}

class Series {
     constructor(date, team1, team2, isTieBreaker){
          this.number = 0;
          this.date = date;
          this.team1 = team1;
          this.team2 = team2;
          this.isTieBreaker = isTieBreaker;
     }

     adjustScores(winnerNum, changeType) {
          // Assigns the winning and losing team of the series
          // based on the passed in winning number
          let winningTeam = null;
          let losingTeam = null;
          if(winnerNum == 1){
               winningTeam = this.team1;
               losingTeam = this.team2;
          }
          else if (winnerNum == 2) {
               winningTeam = this.team2;
               losingTeam = this.team1;
          }
          else 
               return;

          // Changes scores of each team 
          switch(changeType) {
               case "selection": 
                    if(this.isTieBreaker)
                         // Gives the winning team a tiebreaker win
                         winningTeam.tieBreakerWins++;
                    else {
                         // Give the predicted team a win
                         // and the other team a loss
                         winningTeam.wins++;
                         losingTeam.losses++;
                    }
                    break;
               case "flip":
                    if(this.isTieBreaker) {
                         // Switches the tiebreaker win from the previously predicted team 
                         // to the newly predicted team
                         winningTeam.tieBreakerWins++;
                         losingTeam.tieBreakerWins--;
                    }
                    else {
                         // Remove the loss from the now predicted team
                         // and remove the other team's win
                         winningTeam.losses--;
                         losingTeam.wins--;
                         // Give the predicted team a win
                         // and the other team a loss
                         winningTeam.wins++;
                         losingTeam.losses++;
                    }
                    break;
               case "deselection": 
                    if(this.isTieBreaker)
                         // Removes a tiebreaker win from the winning team
                         winningTeam.tieBreakerWins--;
                    else {
                         // Removes the win and loss from the previously 
                         // predicted winner and loser, respectively
                         winningTeam.wins--;
                         losingTeam.losses--;
                    }
                    break;
          }
     }
}

class Tournament {
     constructor(name, tabName, region, type, subType, link){
          this.name = name;
          this.tabName = tabName;
          this.region = region;

          if(type.toLowerCase() == "division"
               || type.toLowerCase() == "div")
               this.type = "Division";
          else if(type.toLowerCase() == "major")
               this.type = "Major";
          else 
               this.type = "None";
          
          switch(this.type){
               case "Division":
                    if(subType.toLowerCase() == "upper")
                         this.subType = "Upper";
                    else if(subType.toLowerCase() == "lower")
                         this.subType = "Lower";
                    break;
               case "Major":
                    if(subType.toLowerCase() == "wild card"
                         || subType.toLowerCase() == "wildcard"
                         || subType.toLowerCase() == "wc")
                         this.subType = "Wild Card";
                    else if(subType.toLowerCase() == "group stage"
                         || subType.toLowerCase() == "groupstage"
                         || subType.toLowerCase() == "GS")
                         this.subType = "Group Stage";
                    break;
               default:
                    this.subType = "None";
                    break;
          }

          this.teams = [];
          this.remainingSeries = [];
          this.link = link;
     }

     addTeam(team){
          this.teams.push(team);
     }

     addSeries(game){
          this.remainingSeries.push(game);
     }

     displayTournament(){
          // Change tournament header and link href
          document.querySelector("#tournamentName").innerHTML = this.name;
          document.querySelector("#source").href = this.link;

          // Draw the current standings' table
          let currentStandingsTable = document.querySelector("#currentStandings");
          this.displayTable(currentStandingsTable);
     
          // Create game buttons
          this.setupGameButtons();
          
          // Draw the future standing's table
          let futureStandingsTable = document.querySelector("#futureStandings");
          this.displayTable(futureStandingsTable);
     }

     findTeamByName(teamName){
          for(let i = 0; i < this.teams.length; i++){
               if(this.teams[i].name == teamName
                    || this.teams[i].abbrev == teamName)
                    return this.teams[i];
          }
          return undefined;
     }

     findTeamIndexByName(teamName){
          for(let i = 0; i < this.teams.length; i++){
               if(this.teams[i].name == teamName
                    || this.teams[i].abbrev == teamName)
                    return i;
          }
          return -1; 
     }

     displayTable(table){
          // Clear the table
          table.innerHTML = '';
          for(let i = 0; i < this.teams.length; i++) {
               // Create a new table row for the team
               let tableRow = document.createElement("tr");
               // Get the place the team is in (1-8)
               let place = document.createElement("td");
               let index = this.teams[i].place;
               place.innerHTML = index;
               tableRow.appendChild(place);
               // Get the team's name
               let teamName = document.createElement("td");
               teamName.innerHTML = this.teams[i].name;
               tableRow.appendChild(teamName);
               // Get the team's score
               let teamScore = document.createElement("td");
               if(this.teams[i].isTied)
                    teamScore.innerHTML = this.teams[i].wins + "-" + this.teams[i].losses + " (" + this.teams[i].tieBreakerWins + ")";
               else 
                    teamScore.innerHTML = this.teams[i].wins + "-" + this.teams[i].losses;
               // Color row
               this.colorRow(i, place);
               // Add the score to the table row 
               // and the table row to the table
               tableRow.appendChild(teamScore);
               table.appendChild(tableRow);
          }
     }

     colorRow(index, place){
          // Color the row depending on the place
          let teamPlace = index + 1;

          switch(this.type){
               case "Division":
                    // Upper Division
                    if(this.subType == "Upper"){
                         // #1 blue
                         if(teamPlace == 1)
                              place.classList.add("table-primary");
                         // #2 light blue
                         else if(teamPlace == 2)
                              place.classList.add("table-info");
                         // Bottom 2 red, 
                         else if (teamPlace == this.teams.length || teamPlace == this.teams.length - 1)
                              place.classList.add("table-danger");
                         // Rest dependent on region
                         else {
                              // Both EUs, China, and SEA's 3rd place are green
                              if(teamPlace == 3 &&
                                   (this.region == "WEU"
                                   || this.region == "China"
                                   || this.region == "EEU"
                                   || this.region == "SEA"))
                                   place.classList.add("table-success");
                              // WEU & China's 4th place are green
                              else if(teamPlace == 4 &&
                                   (this.region == "WEU"
                                   || this.region == "China"))
                                   place.classList.add("table-success");
                              // Rest are yellow
                              else 
                                   place.classList.add("table-warning");
                         }
                    }
                    // Lower Division
                    else if(this.subType == "Lower"){
                         // Top 2 green
                         if(teamPlace == 1 || teamPlace == 2)
                              place.classList.add("table-success");
                         // Bottom 2 red
                         else if (teamPlace == this.teams.length || teamPlace == this.teams.length - 1)
                              place.classList.add("table-danger");
                         // Rest yellow
                         else 
                              place.classList.add("table-warning");
                    }
                    break;
               case "Major":
                    // Major Wild Card
                    if(this.subType == "Wild Card") {
                         // Top 2 green
                         if(teamPlace == 1 || teamPlace == 2)
                              place.classList.add("table-success");
                         // Rest red
                         else 
                              place.classList.add("table-danger");
                    }
                    // Major Group Stage
                    else if(this.subType == "Group Stage") {
                         // Top 2 green
                         if(teamPlace == 1 || teamPlace == 2)
                              place.classList.add("table-success");
                         // Bottom 2 red
                         else if (teamPlace == this.teams.length || teamPlace == this.teams.length - 1)
                              place.classList.add("table-danger");
                         // Rest yellow
                         else 
                              place.classList.add("table-warning");
                    }
                    break;
               default:
                    break;
          }
     }

     setupGameButtons(){
          let gamesList = document.querySelector("#remainingGamesList");
          gamesList.innerHTML = '';
          for(let i = 0; i < this.remainingSeries.length; i++){
               // Create a header for the date if it is different
               if(i == 0 || 
                    this.remainingSeries[i].date != this.remainingSeries[i - 1].date){
                    let date = document.createElement("h4");
                    date.innerHTML = this.remainingSeries[i].date;
                    gamesList.appendChild(date);
               }
               // Create list item element
               let matchup = document.createElement("li");
               matchup.classList.add("matchup");
               // Calculate and update the series number
               let seriesNum = i + 1;
               this.remainingSeries[i].number = seriesNum;
               // Create a button for team 1
               let buttonTeam1 = this.createTeamButton(this.remainingSeries[i].team1);
               buttonTeam1.classList.add("team1");
               buttonTeam1.id = "series" + seriesNum + "team1";
               matchup.appendChild(buttonTeam1);
               // "vs" in between text
               let versusText = document.createElement("p");
               versusText.innerHTML = "vs";
               matchup.appendChild(versusText);
               // Create a button for team 2
               let buttonTeam2 = this.createTeamButton(this.remainingSeries[i].team2);
               buttonTeam2.classList.add("team2");
               buttonTeam2.id = "series" + seriesNum + "team2";
               matchup.appendChild(buttonTeam2);
               // Add "TB" next to the series if it is a tiebreaker
               if(this.remainingSeries[i].isTieBreaker) {
                    let tbText = document.createElement("p");
                    tbText.innerHTML = "(TB)";
                    matchup.appendChild(tbText);
               }
               // Append the list item to the list
               gamesList.appendChild(matchup);
          }
          // Displays a message if there are no remaining games
          if(gamesList.childElementCount == 0){
               let message = document.createElement("p");
               message.innerHTML = "No games remaining."
               gamesList.appendChild(message);
          }
     }

     createTeamButton(team) {
          let button = document.createElement("button");
          button.innerHTML = team.name;
          button.classList.add("btn");
          button.classList.add("btn-primary");
          button.onclick = teamButtonClicked;
          return button;
     }

     sortTeams(){
          let changes = 0;
          do{
               changes = 0;
               for(let i = 0; i < this.teams.length; i++){
                    this.teams[i].isTied = false;
                    // If the team is the first team, then return 1 (nothing to compare to)
                    if(i == 0)
                         continue;

                    // If the current team has more wins than the previous team, then they are flipped
                    if(this.teams[i].wins > this.teams[i - 1].wins){
                         let temp = this.teams[i - 1];
                         this.teams[i - 1] = this.teams[i];
                         this.teams[i] = temp;
                         changes++;
                    }
                    // If the teams have the same wins, then the losses are checked
                    else if(this.teams[i].wins == this.teams[i - 1].wins){
                         // If the current team has less losses than the previous team, then they are flipped
                         if(this.teams[i].losses < this.teams[i - 1].losses){
                              let temp = this.teams[i - 1];
                              this.teams[i - 1] = this.teams[i];
                              this.teams[i] = temp;
                              changes++;
                         }
                         // If the teams have the same losses, then the tiebreaker wins are checked
                         else if(this.teams[i].losses == this.teams[i - 1].losses) {
                              // If the current team has more tiebreaker wins than the previous team, then they are flipped
                              if(this.teams[i].tieBreakerWins > this.teams[i - 1].tieBreakerWins){
                                   let temp = this.teams[i - 1];
                                   this.teams[i - 1] = this.teams[i];
                                   this.teams[i] = temp;
                                   changes++;
                              } else {
                                   // If the wins, losses, and tiebreaker wins are the same, 
                                   // then both the current team and the previous team
                                   // are set to be tied
                                   this.teams[i].isTied = true;
                                   this.teams[i - 1].isTied = true;
                              } 
                         }
                    }
               }
          } while(changes > 0);
          this.calculateTeamPlaces();
     }

     calculateTeamPlaces(){
          for(let i = 0; i < this.teams.length; i++){
               // If the team is the first team, then return 1 (nothing to compare to)
               if(i == 0){
                    this.teams[i].place = i + 1;
                    continue;
               }
               // If the currnet team has less wins than the previous team
               if(this.teams[i].wins < this.teams[i - 1].wins){
                    let duplicates = 1;
                    for(let j = i - 1; j >= 0; j--){
                         if(this.teams[j].name != this.teams[i - 1].name
                              && this.teams[j].place == this.teams[i - 1].place)
                                   duplicates++;
                    }
                    if(duplicates > 1)
                         this.teams[i].place = this.teams[i - 1].place + duplicates;
                    else
                         this.teams[i].place = this.teams[i - 1].place + 1;
                    continue;
               }
               // If the teams have the same wins, then the losses are checked
               else if(this.teams[i].wins == this.teams[i - 1].wins){
                    // If the current team has more losses, it is placed beneath the previous team
                    if(this.teams[i].losses > this.teams[i - 1].losses){
                         let duplicates = 1;
                         for(let j = i - 1; j >= 0; j--){
                              if(this.teams[j].name != this.teams[i - 1].name
                                  && this.teams[j].place == this.teams[i - 1].place)
                                   duplicates++;
                         }
                         if(duplicates > 1)
                              this.teams[i].place = this.teams[i - 1].place + duplicates;
                         else
                              this.teams[i].place = this.teams[i - 1].place + 1;
                         continue;
                    }
                    // If the losses are the same
                    else if (this.teams[i].losses == this.teams[i - 1].losses){
                         // If the current team has more tiebreaker wins than the previous team, then they are flipped
                         if(this.teams[i].tieBreakerWins == this.teams[i - 1].tieBreakerWins){
                              this.teams[i].place = this.teams[i - 1].place;
                         } else if (this.teams[i].tieBreakerWins < this.teams[i - 1].tieBreakerWins){
                              let duplicates = 1;
                              for(let j = i - 1; j >= 0; j--){
                                   if(this.teams[j].name != this.teams[i - 1].name
                                   && this.teams[j].place == this.teams[i - 1].place)
                                        duplicates++;
                              }
                              if(duplicates > 1)
                                   this.teams[i].place = this.teams[i - 1].place + duplicates;
                              else
                                   this.teams[i].place = this.teams[i - 1].place + 1;
                              continue;
                         }
                    }
               }
          }
     }
}