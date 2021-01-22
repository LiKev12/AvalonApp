# AvalonApp

## About
This [app](https://avalonapp.io/) was a hobby project created by 2 friends to allow fans of the popular Avalon board game to play online.

## Technologies

- ReactJS (Frontend)
- NodeJS and Express (Backend)
- MongoDB (Database)
- SocketIO (for real-time gameplay and chat)

## How to Play
1. Register a user (requires username, email, and password)
2. Create a game in the lobby and join the game room
3. Wait for others to join your newly created game room (or invite your friends) 
4. Select the roles and setup for your game
5. Play!

## Features

1. Private and public games
    * Private games require passwords while public games do not
    * Ongoing private games and public games are visible in the game lobby
    * Spectators may spectate both private and public games (spectate private games with password)
    
2. Rated and unrated games
    * Each player starts with an initial ELO rating of 1500 upon register
    * Average ELO rating of each team is used to calculate individual rating change after games
    * Abandoned games will negatively impact the ELO of all players in game
    
3. Game Utilities
    * Each game room includes the following:
        * Transcript of game history
        * Voting record of players for all proposed teams
        * Player chat

4. Individual Stats
    * Overall individual stats and head-to-head stats available in the **Stats** page
    * Individual stats show game history, win/loss by team, and win/loss by role
    
5. App Stats
    * Number of players and users over time on app displayed in the **About** page
    * Top 5 players on site by rating are featured on the leaderboard in the **About** page


## Contact
- See **About** page for more details, or reach me at avalon.app.game@gmail.com
- Open to comments, questions, or suggestions on how to improve the experience :) 

## FAQ
**Q:** How do I play Avalon?

**A:** You can find this info in the **Rules** page, or click [here](http://upload.snakesandlattes.com/rules/r/ResistanceAvalon.pdf) for the written rules and [here](https://youtu.be/rXlK3NZjLGc) for the video explanation.

##

**Q:** How is the game room leader determined?

**A:** The game room leader is the first person to enter the room. This may not necessarily be the person who originally created the room.

##

**Q:** Are there any restrictions for a valid game setup?

**A:** Yes, the following restrictions apply:
1. The game must contain at least 5 players and at most 12 players.
2. There must be at least 1 role of each team.
3. Greater than half of the total players must be on the Resistance team. 
4. Percival and Morgana, if included, must be included together.
5. Drunk Merlin can only be included if Merlin is also included.

##

**Q:** How do I know what role my avatar is in the game?

**A:** See the **Rules** page for more info.

##

**Q:** What exactly does the Drunk Merlin role do?

**A:** Short answer: cause chaos. Long answer: Drunk Merlin initially sees himself as Merlin, and has the exact information Merlin would have, except that the information is completely random. Therefore, it is possible that Drunk Merlin thinks he sees players on the Spy team, but who are really on the Resistance team. The tricky part is, this causes Merlin to be less confident about his role, as there is a real possibility he could be Drunk Merlin. 

##

**Q:** Who chooses to assassinate if the assassin role was not included in the game?

**A:** The order of precedence for assassinating goes: Assassin, Morgana, Minion, Mordred, Oberon. Of course, it doesn't really matter too much who gets to choose, as the Spy team should first discuss amongst themselves and reach a consensus on a target.

##

**Q:** Is there a time limit to the games?

**A:** Yes, there is a hard time limit of 4 hours until the game is designated as finished and deleted.

##

**Q:** I accidentally closed my browser, can I still rejoin the game?

**A:** Yes, please log back in and rejoin the game room.

##

**Q:** The game seems frozen / I'm not sure what to do.

**A:** First, make sure you've read the rules and are familiar with the game. For example, if the game has Excalibur enabled, the team leader must first designate a fellow player to give Excalibur before the team can be proposed. Reading the game transcript can also be helpful to see which action is pending. If everything seems in place and you believe the UI is not correctly reflecting the game state, please refresh the game and rejoin the room.

##

**Q:** How does the ELO rating system work?

**A:** ELO ratings are used to calculate the relative skill of players, with a higher rating indicating higher skill level. Instead of showing exact formulas, I think the intuition is shown better by example. Say a game includes 3 players on the Resistance Team and 2 players on the Spy team, and that the average rating of the teams are 1600 and 1200, respectively. Based on relative skill alone, the Resistance team is expected to win the game. Therefore, the ELO gained by the Resistance team if the Resistance team wins would be less than the ELO gained by the Spy team if the Spy team wins. No matter what, each player on the winning team will gain ELO and each player on the losing team will lose ELO.

##

**Q:** Can I set the game to be rated for only some players in the game?

**A:** No, setting the game as rated will set the game to be rated for all players in the game.

##

**Q:** Can I play on mobile?

**A:** Unfortunately, this app was not designed for mobile use. Please use this as a web app for best experience.

##

**Q:** What if I forgot my username or password?

**A:** Unfortunately, we currently do not support password resets or username lookup. Please create a new user, or contact me.

##

**Q:** Can I find a bug in this app and use it to cheat?

**A:** Maybe if you dig hard enough, but y tho
