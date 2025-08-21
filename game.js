let reveal = false;
let guessX = 45;
let guessY = 45;
let shipType=7;
let vship=null;
let guess = [];
let answer="P";
let firstPrompt="";
let secondPrompt="";
let lastSuccessX=45;
let lastSuccessY=45;
let random=0;

const created=[false, false, false, false, false];
const placed=[false, false, false, false, false];
const myShips=[null,null,null,null,null,null];

const shipClasses = [Carrier, BattleShip, Destroyer, Submarine, PatrolBoat];

const myregEx1 = /^([A-Z])([0,1,2,3,4,5,6,7,8,9])$/;
const myregEx2 = /^([A-Z])([0,1,2,3,4,5,6,7,8,9]),([0,1])$/;
const myregEx3= /^([0,1,2,3,4])$/;
const myregEx4= /^([y,n])$/i;
import readlineSync from "readline-sync";
import { Ship, Carrier, BattleShip, Destroyer, Submarine, PatrolBoat } from "./ships.js";
import { Cell, Board } from "./board.js";

let bsize = 10;
function placeShip(ShipClass) {
    
    let ship = new ShipClass(Math.floor(Math.random() * bsize), Math.floor(Math.random() * bsize), Math.floor(Math.random() * 2));
     while (!gameBoard.canPlace(ship)) {
        ship.changeLocation(Math.floor(Math.random() * bsize), Math.floor(Math.random() * bsize));
        ship.changeDirection(Math.floor(Math.random() * 2));
    }
   gameBoard.place(ship);
}

function createShip(ShipClass, i) {
  let ship = new ShipClass(45,45,0);
  created[i]=true;
  return ship;
}
// Intro
console.clear();


// Create Board Computer

const gameBoard = new Board(bsize, 0);
// place ships

shipClasses.forEach(placeShip);

const playerBoard= new Board(bsize, 1);

while (!placed.every(x => x)) 
{
  shipType=7;
  firstPrompt="";
  console.clear();
  console.log("Welcome to Battleship");
  console.log("Place your ships");
  console.table(playerBoard.printBoard(true));
  while (shipType>4 && firstPrompt.trim().length == 0) {
    firstPrompt=readlineSync.question("Pick  a ship type to place 0=Carrier 1=Battleship 2=Destroyer 3=Submarine 4=PatrolBoat").toUpperCase();

  if (!myregEx3.test(firstPrompt)) {
    console.log("Invalid entry");
    shipType=7;
    firstPrompt="";
} else {
  shipType=Number(firstPrompt);
}
  }
  if (!created[shipType]) {
    myShips[shipType]= createShip(shipClasses[shipType], shipType);
  } 
  if (placed[shipType]) {
    answer="P";
    firstPrompt=""; 
    while (answer=="P" && firstPrompt.trim().length == 0) {
      firstPrompt=readlineSync.question("You already placed that do you want to change it Y or N?").toUpperCase();
      if (!myregEx4.test(firstPrompt)) {
        answer="P"
        firstPrompt="";
  } else {answer=firstPrompt;}
    
  }
  if (answer=="Y") {
    placed[shipType]=false;
    playerBoard.remove(myShips[shipType]);
    myShips[shipType].changeLocation(45,45);
    myShips[shipType].changeDirection(2);
  } else {
    shipType=7;
    firstPrompt="";
  }
}
if (shipType<5) {

  while (!placed[shipType]) {
firstPrompt="";
while (myShips[shipType].x>bsize && myShips[shipType].y>bsize && firstPrompt.trim().length == 0 ) {
   firstPrompt=readlineSync.question("Pick a location A0-J9 and direction 0 horizontal 1 vertical (A3,1 C3,0)").toUpperCase();
      if (!myregEx2.test(firstPrompt)) {
        myShips[shipType].changeLocation(43,43);
  } else {
    guess = firstPrompt.split("");
    myShips[shipType].changeLocation(Number(guess[1]), guess[0].charCodeAt(0) - 65);
    myShips[shipType].changeDirection(Number(guess[3]))
  }

  if (!playerBoard.canPlace(myShips[shipType])) {
    myShips[shipType].changeLocation(45,45);
    firstPrompt="";
  }

}
 playerBoard.place(myShips[shipType]);
 placed[shipType]=true;
} }


}
console.clear();
console.log("Your Board");
console.table(playerBoard.printBoard(true));
readlineSync.question("Hit Enter to continue");


 while (!reveal) {

  //Player turn
  console.clear();
  console.log("Computer's Board");
  console.table(gameBoard.printBoard(reveal));
  // guess 45, 45 = No guess 43,43 = guess not in right format
  guessX = 45;
  guessY = 45;
  while (
    !gameBoard.isValidGuess(guessX, guessY) &&
    secondPrompt.trim().length == 0
  ) {
    secondPrompt = readlineSync.question(`Make a guess eg.. A1, B2, etc... `).toUpperCase();

    if (myregEx1.test(secondPrompt)) {
      guess = secondPrompt.split("");
      guessY = guess[0].charCodeAt(0) - 65;
      guessX = Number(guess[1]);
    } else {
      guessX = 43;
      guessY = 43;
    }
    if (!gameBoard.isValidGuess(guessX, guessY)) {
      guessX = 45;
      guessY = 45;
      secondPrompt = "";
    }
  }
  gameBoard.guess(guessX, guessY);
  reveal = gameBoard.gameWon();
  guessX = 45;
  guessY = 45;
  secondPrompt = "";
  readlineSync.question("Hit Enter to continue");

  if (!reveal) {
    console.clear();
  console.log("Your Board");
  console.table(playerBoard.printBoard(reveal));
  if (lastSuccessX==45 && lastSuccessY==45) {
  guessX=Math.floor(Math.random() * bsize);
  guessY=Math.floor(Math.random() * bsize);
  while (!playerBoard.isValidGuess(guessX,guessY)) {
    guessX=Math.floor(Math.random() * bsize);
  guessY=Math.floor(Math.random() * bsize);
  }
} else {
 guessX= Math.floor(Math.random() * 6) + lastSuccessX - 3;
guessX = Math.max(0, Math.min(9, guessX));
 guessY= Math.floor(Math.random() * 6) + lastSuccessY - 3;
guessY = Math.max(0, Math.min(9, guessY));
  while (!playerBoard.isValidGuess(guessX,guessY)) {
    guessX= Math.floor(Math.random() * 6) + lastSuccessX - 3; 
   guessX = Math.max(0, Math.min(9, guessX));
 guessY= Math.floor(Math.random() * 6) + lastSuccessY - 3;
guessY = Math.max(0, Math.min(9, guessY));
  }
}
  playerBoard.guess(guessX,guessY);
  if (playerBoard.isHit(guessX,guessY)) {
    lastSuccessX=guessX;
    lastSuccessY=guessY;
  }
  if (playerBoard.isSunk(guessX,guessY)) {
    lastSuccessX=45;
    lastSuccessY=45;
  }
  reveal=playerBoard.gameWon();
   readlineSync.question("Hit Enter to continue");
  }
}







console.clear();
console.log("Computer Board");
console.table(gameBoard.printBoard(reveal));
console.log("Your Board");
console.table(playerBoard.printBoard(true));

if (gameBoard.gameWon()) {
console.log(`
========
__   _______ _   _   _    _ _____ _   _
\\ \\ / /  _  | | | | | |  | |_   _| \\ | |
 \\ V /| | | | | | | | |  | | | | |  \\| |
  \\ / | | | | | | | | |/\\| | | | | . ' |
  | | \\ \\_/ / |_| | \\  /\\  /_| |_| |\\  |
  \\_/  \\___/ \\___/   \\/  \\/ \\___/\\_| \\_/
========
`);
} 
else {
  console.log(`
  ========
__   _______ _   _   _    _____  _____  _____ 
\\ \\ / /  _  | | | | | |  /  _  || ____||_   _| 
 \\ V /| | | | | | | | |  | | | || |___   | |   
  \\ / | | | | | | | | |  | | | ||____ |  | |  
  | | \\ \\_/ / |_| | | |__\\ \\_/ / ___| |  | |
  \\_/  \\___/ \\___/  \\____|\\___/ |_____|  |_|
========
    `);

}
