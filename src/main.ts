import './style.css'

const messages = {
  init: "Drag your ships to the map",
  start: "Click start to proceed", 
  "your turn": "Click on the cells of the enemy's map to find and destro all five of the enemy's ships",
  won: "You Won!!!",
  lost: "You lost, try again!!",
  hit: "Boom, enemy ship is hit",
  miss: "Oops, nothing there", 
  "already hit": "This cell is already hit. Try a new target",
}

const messageContainer = document.getElementById("message") as HTMLElement 
const changeMessage = (newText: string) => {
  messageContainer.style.opacity = "0"

  setTimeout(() => {
    messageContainer.innerHTML = newText
    messageContainer.style.opacity = "1"
  }, 500)
}
changeMessage(messages.init)

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
// Get all player cells
const myCells = Array.from(playerBoard.getElementsByClassName("cell")) as HTMLElement[];
const computerCells = Array.from(computerBoard.getElementsByClassName("cell")) as HTMLElement[];


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

// Drag Ships

const checkValidTarget = (id:number) => {
    const size = allShips.find((ship) => ship.name === draggingShip)?.size || 0;
    const x = Math.floor(id / 10);
    const y = id - x * 10;

    const cells = getShipCells(size, x, y, isFlipped, "player");
    if(cells.some(cell => cell && cell.classList.contains("taken")))
      return false;

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


let draggingShip = ''
const onDragStart = (e: MouseEvent) => {
  draggingShip = (e.target as HTMLElement).classList[0]
}

// When you drag over a cell
const onDragOver = (e : DragEvent) => {
  e.preventDefault();
  const targetID = (e.target as HTMLElement).id;
  const id = Number(targetID.split("cell-")[1]);
  const isValidDrop = checkValidTarget(id);
  if (isValidDrop) {
    highlightCells(id);
  }
};

const OnDragLeave = (e: DragEvent) => {
  e.preventDefault();
  myCells.forEach ((cell)=> cell.classList.remove("highlight")) 
}

// When you drop on a cell
const onDrop = (e : DragEvent) => {
  e.preventDefault();

  const highlightedCells = myCells.filter((cell) =>
    cell.classList.contains("highlight")
  );
  
  if (highlightedCells.length === 0) return;

  const index = draggableShips.findIndex(ship => ship.classList.contains(draggingShip))

  if(index !== -1){
    draggableShips[index].remove();
    draggableShips.splice(index, 1);

    console.log(draggableShips);
  }

  myCells.forEach(cell => {
    if(cell.classList.contains('highlight')){
      cell.classList.remove('highlight')
      cell.classList.add('taken')
      cell.classList.add(draggingShip)
    }
  })
  draggableShips
    .find(ship => ship.classList.contains(draggingShip))
    ?.remove();

    if(draggableShips.length === 0) {
      document.getElementById('rotate')?.removeEventListener("click", rotate)
      document.getElementById('rotate')?.setAttribute('disabled', 'true')
      document.getElementById('start')?.removeAttribute('disabled'),
      changeMessage(messages.start);
    }
};

let gameOver = false;
let turn: "player"| "computer" = "computer"

const handlePlayerClick = (e: MouseEvent) => {
  if (gameOver)
    return

  if(turn === "player") {
    const target = e.target as HTMLElement
    if(target.classList.contains('hit') || target.classList.contains('miss')){
      changeMessage(messages["already hit"]);
      return
    }
    if(target.classList.contains('taken')) {
      changeMessage(messages.hit)
      target.classList.add('hit');
    }
    else{
      changeMessage(messages.miss)
      target.classList.add('miss');
    }
  }
}

const startGame = () => {
  turn = "player"
  computerCells.forEach(cell => cell.addEventListener("click", handlePlayerClick)
  );
  document.getElementById("start")?.setAttribute("disabled", "true")
  changeMessage(messages["your turn"])
};
document.getElementById("start")?.addEventListener("click", startGame)

// Add drag events to each cell
myCells.forEach(cell => {
  cell.addEventListener("dragover", onDragOver)
  cell.addEventListener("dragleave", OnDragLeave)
  cell.addEventListener("drop", onDrop)
})

const draggableShips = Array.from(document.querySelectorAll('#ships div')) as HTMLElement[];

draggableShips.forEach((ship) => {
  ship.addEventListener("dragstart", onDragStart);
});

// Get all ships
const ships = Array.from(document.querySelectorAll("#ships div")) as HTMLElement[];
// Add click event to ships
ships.forEach(ship => ship.addEventListener("mousedown", onDragStart))