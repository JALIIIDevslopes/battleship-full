Playing  BattleShip


"node game.js"
or "npm run start-game"


Setting up ships

First pick ship type
0=Carrier  = 5 spaces icon =🔵
1=Battleship = 4 spaces icon = 🟣
2=Destroyer = 3 spaces icon = 🟢
3=Submarine = 3 spaces icon = 🟡
4=PatrolBoat = 2 spaces icon = 🟠
(if you pick a ship type you already placed it will ask if you want to change location)

Then it will ask you the location of the top (or left) of the ship (A0-J9) followed by a , followed by
(0 for horizontal or 1 for vertical) Example F6,0   A2,1 etc...

The system will let you know if the resulting ship would go beyond the board or if it is already occupied by another ship
Once all 5 ships are placed it is time to play

----
Playing

You are give a 10X10 board (A0-J9) and all you is empty spaces "-"
You pick a guess (A0-J9) example B2
it will tell you if you already chose that position,
It will then tell you if you missed (no ship was there ) and show a "❗" on your next turn or
you made a hit on a ship and show a "❌" on your next turn
if the resulting hit causing one of the ships to sink it will tell you the type of ship you sunk and show the ship icons on your next turn

During the computer's turn you see where your ships are.
the computer makes a guess,
if it misses it will show a "❗" on its next turn
if it makes a hit it will show a  "❌" on its next turn  it will say if it sinks one of your ships

===
Ending

The games continues until either the player or the computer sinks all of the other's ships



 

