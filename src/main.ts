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

//board
const createGrid = (element: HTMLElement) => {
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell");
    cell.id = `cell-${i}`
    element.append(cell)
  }
}

const playerBoard = document.getElementById("player")!
createGrid(playerBoard)

const computerBoard = document.getElementById("computer")!
createGrid(computerBoard)
