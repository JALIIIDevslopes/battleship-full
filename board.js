export class Cell {
  constructor() {
    this.icon = "-";
    this.struct = false;
    this.ship = null;
  }

  isEmpty() {
    return this.icon == "-";
  }
  changeIcon(icon) {
    this.icon = icon;
  }
  isSunk() {
    return this.ship == null?false:this.ship.isSunk();
  }

  name() {
     return this.ship == null?"":this.ship.name;
     }
  remove() {
    this.icon = "-";
    this.struct = false;
    this.ship = null;
  }

  setShip(ship) {
    this.ship = ship;
  }

  showIcon(revealMe, bId) {
    return (
      (this.isHit() && this.isSunk() && bId == 0) ||
      revealMe ||
      (!this.isHit() && bId == 1)
    );
  }

  showX(bId) {
    return (
      (this.isHit() && !this.isSunk() && bId == 0) ||
      (this.isHit() && bId == 1));
  }

  strike() {
    this.struct = true;
    if (!this.isEmpty()) {
      this.ship.Hit();
    }
  }
  isHit() {
    return this.struct;
  }

  printCell(revealIt, bId) {
    return this.isEmpty() && !this.isHit()
      ? "-"
      : this.isEmpty()
      ? "❗"
      : this.showIcon(revealIt, bId)
      ? this.icon
      : this.showX(bId)
      ? "❌"
      : "-";
  }
}

export class Board {
  constructor(size, id) {
    this.size = size;
    this.id=id;
    this.contents = Array.from({ length: size }, () => new Array(size));
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        this.contents[y][x] = new Cell();
      }
    }
    this.id=id;
    this.hits = 0;
    this.neededHits = 0;
  }
  
  isHit(x, y) {
    return this.contents[y][x].isHit();
  }

  isSunk(x,y) {
    return this.contents[y][x].isSunk();
  }
  canPlace(myShip) {
   if (myShip.x == 45 && myShip.y == 45) {
      return false;
   }
      if (myShip.x > 9 || myShip.y > 9) {
        console.log ("Invalid Input");
       return false;
      } else if (
      myShip.x + (myShip.direction == 0 ? myShip.size - 1 : 0) >
        this.size - 1 ||
      myShip.y + (myShip.direction == 1 ? myShip.size - 1 : 0) > this.size - 1
    ) {
        if (this.id == 1) {
        console.log(`Your ${myShip.name} can't go there`);
      } //The computer doesn't need to be told this
      return false;
    }
    for (let i = 0; i < myShip.size; i++) {
        if (
        !this.contents[myShip.y + i * (myShip.direction == 1 ? 1 : 0)][
          myShip.x + i * (myShip.direction == 0 ? 1 : 0)
        ].isEmpty()
      ) {
         if (this.id == 1) {
        console.log("That area is occupied");
      } //The computer doesn't need to be told this
        return false;
      }
    }
    return true;
  }
  

  place(myShip) {
    for (let i = 0; i < myShip.size; i++) {
      this.contents[myShip.y + i * (myShip.direction == 1 ? 1 : 0)][
        myShip.x + i * (myShip.direction == 0 ? 1 : 0)
      ].changeIcon(myShip.icon);
      this.contents[myShip.y + i * (myShip.direction == 1 ? 1 : 0)][
        myShip.x + i * (myShip.direction == 0 ? 1 : 0)
      ].setShip(myShip);
    }
    this.neededHits = this.neededHits + myShip.size;
  }

  remove(myShip) {
    for (let i = 0; i < myShip.size; i++) {
      this.contents[myShip.y + i * (myShip.direction == 1 ? 1 : 0)][
        myShip.x + i * (myShip.direction == 0 ? 1 : 0)
      ].remove();
    }
    this.neededHits = this.neededHits - myShip.size;
  }

  showRow(row, reveala) {
    let temp = [];
    for (let i = 0; i < this.size; i++) {
      temp.push(this.contents[row][i].printCell(reveala, this.id));
    }
    return temp;
  }

  printBoard(revealZ) {
    let temp = {};
    for (let i = 0; i < this.size; i++) {
      temp[String.fromCharCode(65 + i)] = this.showRow(i, revealZ);
    }
    return temp;
  }

  isValidGuess(x, y) {
    if (x == 45 && y == 45) {
      return false;
    } else if (x < 0 || x > this.size - 1 || y < 0 || y > this.size) {
      console.log("Sorry but that is not a valid input");
      return false;
    } else if (this.contents[y][x].isHit()) {
      if (this.id == 0) {
        console.log("You already picked there");
      } //The computer doesn't need to be told this
      return false;
    } else {
      return true;
    }
  }
  guess(x, y) {
    this.contents[y][x].strike();
    if (!this.contents[y][x].isEmpty()) {
      this.hits++;
    }
    let sunkLiteral=` and sunk ${this.id==0?"my ":"your "}${this.contents[y][x].name()}`;
    console.log(`${this.id==0?"You":"I"} ${this.contents[y][x].isEmpty()?"missed":"hit"}${this.contents[y][x].isSunk()?sunkLiteral:"."}`);
  }

  gameWon() {
    let revealMe = this.hits == this.neededHits;
    {
      return revealMe;
    }
  }
}
