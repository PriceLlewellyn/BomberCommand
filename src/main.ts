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

const getShipCells = (size: number, x: number, y: number, isFlipped: boolean, player: string) => {
  const board = player === "computer" ? computerBoard : playerBoard

  const cells = (Array.from(board.getElementsByClassName("cell"))) as HTMLElement[]

  const spots = new Array(size).fill(-1).map((_, i) => {
    if(isFlipped) {
      return x * 10 + y + i * 10;
    } else {
      return x * 10 + y + i;
    }
  })
  .map(i => cells[i])

  return spots
}

const addShipToGrid = (ship: Ship) => {

  while(true) {
    // Randomly choose horizontal or vertical
    const isFlipped = Math.random() < .5
    // Pick a starting position that keeps the ship in bounds
    const y = isFlipped ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * (10 - ship.size))
    const x = isFlipped ? Math.floor(Math.random() * (10 - ship.size)) : Math.floor(Math.random() * 10)

    // Calculate the cell indexes the ship will occupy
    const spots = getShipCells(ship.size, x, y, isFlipped, "computer")

    // check if all cells are free then place ship
    if (spots.every(spot => !spot.classList.contains('taken'))){
      spots.forEach(spot => spot.classList.add('taken',ship.name))
      break
    }
  }
};

const allShips = [destroyer, submarine, cruiser, battleship, carrier];
allShips.forEach(ship => addShipToGrid(ship));



const checkValidTarget = (id:number) => {
    const size = allShips.find(ship => ship.name === draggingShip)?.size || 0;
    const x = Math.floor(id/ 10);
    const y = id - x * 10;


    if (!isFlipped) {
      if (size + y > 10) return false;
      return true;
    } else {
      if (size + x > 10) return false;
      return true;
    }
};

const highlightCells = (id: number) => {
    const size = allShips.find(ship => ship.name === draggingShip)?.size || 0;
    const x = Math.floor(id/ 10);
    const y = id - x * 10;

    const validCells = getShipCells(size,x,y,isFlipped, "player")
    validCells.forEach(cell => cell.classList.add("highlight"))
}

const ondragstart = (e : MouseEvent) => {
  console.log(e.target)
};

let draggingShip = ''
const onDragStart = (e: MouseEvent) => {
  draggingShip = (e.target as HTMLElement).classList[0]
}

// When you drag over a cell
const onDragOver = (e : DragEvent) => {
  const targetID = (e.target as HTMLElement).id;
  const id = Number(targetID.split("cell-")[1]);
  const isValidDrop = checkValidTarget(id);
  if (isValidDrop) {
    highlightCells(id);
  }
};

const OnDragLeave = (E: DragEvent) => {
  myCells.forEach ((cell)=> cell.classList.remove("highlight")) 
}

// When you drop on a cell
const onDrop = (e : DragEvent) => {
  console.log(e.target)
};

// Get all player cells
const myCells = Array.from(playerBoard.getElementsByClassName("cell")) as HTMLElement[];
// Add drag events to each cell
myCells.forEach(cell => {
  cell.addEventListener("dragover", onDragOver)
  cell.addEventListener("dragleave", OnDragLeave)
  cell.addEventListener("drop", onDrop)
})

// Get all ships
const ships = Array.from(document.querySelectorAll("#ships div")) as HTMLElement[];
// Add click event to ships
ships.forEach(ship => ship.addEventListener("mousedown", ondragstart))