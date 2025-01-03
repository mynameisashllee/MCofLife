const gridSize = 20;
const container = document.getElementById('game-container');
const palette = document.getElementById('palette');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const infoButton = document.getElementById('info-button');
const infoSection = document.getElementById('info-section');

let currentBlock = 'grass';
const blocks = ['grass', 'amethyst', 'stone', 'sand', 'water'];
let grid = createEmptyGrid();

container.style.gridTemplateRows = `repeat(${gridSize}, 20px)`;
container.style.gridTemplateColumns = `repeat(${gridSize}, 20px)`;

// reusable function to create an empty grid
function createEmptyGrid() {
    return Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
}

// initialize the grid display
function createGrid() {
    container.innerHTML = '';
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = `cell ${grid[row][col] || ''}`;
            cell.dataset.row = row;
            cell.dataset.col = col;
            container.appendChild(cell);
        }
    }
}

// update grid cell on click
container.addEventListener('click', (event) => {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    if (row && col) {
        grid[row][col] = currentBlock;
        event.target.className = `cell ${currentBlock}`;
    }
});

// palette selection
palette.addEventListener('click', (event) => {
    if (event.target.classList.contains('block-selector')) {
        document.querySelectorAll('.block-selector').forEach(block => block.classList.remove('selected'));
        event.target.classList.add('selected');
        currentBlock = event.target.dataset.type;
    }
});

// game of life logic
function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                if (grid[newRow][newCol]) count++;
            }
        }
    }
    return count;
}

function nextGeneration() {
    const newGrid = createEmptyGrid();
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const neighbors = countNeighbors(row, col);
            if (grid[row][col]) {
                newGrid[row][col] = (neighbors === 2 || neighbors === 3) ? grid[row][col] : null;
            } else if (neighbors === 3) {
                newGrid[row][col] = blocks[Math.floor(Math.random() * blocks.length)];
            }
        }
    }
    grid = newGrid;
    createGrid();
}

// start, pause, and reset functionality
let intervalId = null;

startButton.addEventListener('click', () => {
    if (!intervalId) intervalId = setInterval(nextGeneration, 500);
});

pauseButton.addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = null;
});

resetButton.addEventListener('click', () => {
    grid = createEmptyGrid();
    createGrid();
    clearInterval(intervalId);
    intervalId = null;
});

// toggle info section visibility
infoButton.addEventListener('click', () => {
    infoSection.style.display = infoSection.style.display === 'block' ? 'none' : 'block';
});

// block placement with drag functionality
let isMouseDown = false;
let eraseMode = false;

container.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    handleBlockPlacement(event);
});

container.addEventListener('mousemove', (event) => {
    if (isMouseDown) handleBlockPlacement(event);
});

container.addEventListener('mouseup', () => {
    isMouseDown = false;
    eraseMode = false;
});

function handleBlockPlacement(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (row && col) {
        if (eraseMode || grid[row][col]) {
            grid[row][col] = null;
            event.target.className = 'cell';
        } else {
            grid[row][col] = currentBlock;
            event.target.className = `cell ${currentBlock}`;
        }
    }
}

// initialize grid and set default block
createGrid();
document.querySelector(`.block-selector[data-type="${currentBlock}"]`).classList.add('selected');
