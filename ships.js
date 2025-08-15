export class Ship {
  constructor(size, icon, x, y, direction, name) {
    this.size = size;
    this.icon = icon;
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.damage=0;
    this.name=name;
  }

  changeLocation(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
  changeDirection(newDirection) {
    this.direction = newDirection;
  }
   
  Hit() {
    this.damage++;
  }

  isSunk() {
    return (this.damage==this.size)
  }

}

export class Carrier extends Ship {
  constructor(x, y, direction) {
    super(5, "🔵", x, y, direction,"carrier");
  }
}

export class BattleShip extends Ship {
  constructor(x, y, direction) {
    super(4, "🟣", x, y, direction,"battleship");
  }
}



export class  Destroyer extends Ship {
  constructor(x, y, direction) {
    super(3, "🟢", x, y, direction,"destroyer");
  }
}

export class  Submarine extends Ship {
  constructor(x, y, direction) {
    super(3, "🟡", x, y, direction,"submarine");
  }
}


export class PatrolBoat extends Ship {
  constructor(x, y, direction) {
    super(2, "🟠", x, y, direction, "patrolboat");
  }
}
