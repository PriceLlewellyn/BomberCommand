import './style.css'

// Tracks whether ships are rotated
let isFlipped = false;

// Tracks whether ships are rotated
const rotate = () => {
  const shipHolder = document.getElementById("ships")!
  const ships = [...shipHolder.children] as HTMLElement[]

  if (!isFlipped){
    ships.forEach(ship => ship.classList.add("rotated"));
  } else {
    ships.forEach((ship) => ship.classList.remove("rotated"));
  }
   // Switch state for next click
  isFlipped = !isFlipped;
};

// Run rotate when the button is clicked
document.getElementById("rotate")!.addEventListener("click", rotate)

// board
// Creates a 10x10 grid (100 cells) inside the given element
const createGrid = (element: HTMLElement) => {
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell");
    cell.id = `cell-${i}`
    element.append(cell)
  }
}

// Create the player board
const playerBoard = document.getElementById("player")!
createGrid(playerBoard)

// Create the computer board
const computerBoard = document.getElementById("computer")!
createGrid(computerBoard)


class Ship {
  name: string;
  size: number;
  constructor(_name: string, _size: number) {
    this.name = _name;
    this.size = _size;
  }
}

// Create ship instances
const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruiser = new Ship("cruiser", 3);
const battleship = new Ship("battleship", 4);
const carrier = new Ship("carrier", 5);

const addShipToGrid = (ship: Ship) => {
  // Get all cells on the computer board
  const cells = Array.from(computerBoard.getElementsByClassName("cell")) as HTMLElement[]

  while(true) {
    // Randomly choose horizontal or vertical
    const horizontal = Math.random() < .5
    // Pick a starting position that keeps the ship in bounds
    const x = horizontal ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * (10 - ship.size))
    const y = horizontal ? Math.floor(Math.random() * (10 - ship.size)) : Math.floor(Math.random() * 10)

    // Calculate the cell indexes the ship will occupy
    const spots = new Array(ship.size).fill(-1).map((_, i) => {
      if(horizontal) {
        return x * 10 + y + i;
      } else {
        return x * 10 + y + i * 10;
      }
    }).map(i => cells[i])
    
    // check if all cells are free then place ship
    if (spots.every(spot => !spot.classList.contains('taken'))){
      spots.forEach(spot => spot.classList.add('taken',ship.name))
      break
    }
  }
}

const allShips = [destroyer, submarine, cruiser, battleship, carrier];
allShips.forEach(ship => addShipToGrid(ship))