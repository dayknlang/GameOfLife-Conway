const colors = {
    pinkOrchid: '#FFC8DD',
    pinkLavender: '#CDB4DB',
    pinkNade: '#FFAFCC',
    babyBlue: '#A2D2FF',
};


let grid=300;
let timer;
let canvasSize = 300;
const gridSize = 10;
let cellSize = canvasSize / gridSize;
let generation = 0;




function recalculateSizes() {
    canvasSize = floor(windowWidth * 0.5 > 400 ? 400 : windowWidth * 0.5);
    cellSize = canvasSize / gridSize;
}

function windowResized() {
    recalculateSizes();
    resizeCanvas(canvasSize, canvasSize);
}


function setup() {
    document.getElementById('generation').textContent = generation;
    recalculateSizes();
    const canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent('container');

    background(colors.pinkOrchid);
    noLoop();

    grid = Array2D();
}

function equality() {
    let next = grid;
    generation += 1;
    document.getElementById('generation').textContent = generation;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            fill(Boolean(next[j][i]) ? colors.pinkNade : colors.babyBlue);
            rect(cellSize * i, cellSize * j, cellSize, cellSize);
        }
    }

    console.newGroup('Computing...');
    console.table(grid);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            console.newGroup(`(${i},${j})`);
            let neighbours = countNeighbors(grid, i, j);
            if (Boolean(grid[i][j])) {
                console.log('Status: 😐');
                console.log('Less than 2 neighbours?', neighbours < 2);
                console.log('More than 3 neighbours?', neighbours > 3);
                next[i][j] = Boolean(neighbours < 2 || neighbours > 3) ? 0 : 1;
            } else {
                console.log('Status: 💀');
                next[i][j] = Boolean(neighbours === 3) ? 1 : 0;
            }
            console.log(`Next Status: ${Boolean(next[i][j]) ? '😐' : '💀'}`);
            console.groupEnd();
        }
    }
    console.groupEnd();
}

function Array2D() {
    let columns = new Array(gridSize);
    for (let i = 0; i < gridSize; i++) {
        columns[i] = [];
        for (let j = 0; j < gridSize; j++) {
            columns[i][j] = random([0, 1]);
        }
    }
    console.table(columns);
    return columns;
}

function countNeighbors(grid, x, y) {
    console.newGroup(`Counting neighbors...`);
    let aliveNeighbors = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const isSelf = i === 0 && j === 0;
            const insideHorizontal = x + i >= 0 && x + i < gridSize;
            const insideVertical = y + j >= 0 && y + j < gridSize;

            if (insideHorizontal && insideVertical && !isSelf) {
                console.log(`(${x + i},${y + j}): ${grid[x + i][y + j]}`);
                aliveNeighbors += grid[x + i][y + j];
            }
        }
    }
    console.log('Total:', aliveNeighbors);
    console.groupEnd();
    return aliveNeighbors;
}

function start() {
    document.getElementsByClassName('btn btn-outline-secondary').disabled = true;
    document.getElementsByClassName('btn btn-outline-success').disabled = true;
    document.getElementsByClassName('btn btn-outline-danger').disabled = true;
    document.getElementsByClassName('btn btn-outline-info').disabled = true;
    document.getElementsByClassName('btn btn-outline-dark').disabled = false;
    timer = setInterval(() => {
        equality();
    }, 100);
}

function activate(times = 1) {
    let counter = 0;
    document.getElementsByClass('btn btn-outline-primary').disabled = true;
    document.getElementsByClassName('btn btn-outline-secondary').disabled = true;
    document.getElementsByClassName('btn btn-outline-success').disabled = true;
    document.getElementsByClassName('btn btn-outline-danger').disabled = true;
    document.getElementsByClassName('btn btn-outline-info').disabled = true;
    document.getElementsByClassName('btn btn-outline-dark').disabled = false;

    timer = setInterval(() => {
        if (counter === times) {
            stop();
        } else {
            equality();
            counter += 1;
        }
    }, 150);
}

function stop() {
    clearInterval(timer);
    document.getElementsByClassName('btn btn-outline-primary').disabled = false;
    document.getElementsByClassName('btn btn-outline-secondary').disabled = false;
    document.getElementsByClassName('btn btn-outline-success').disabled = false;
    document.getElementsByClassName('btn btn-outline-danger').disabled = false;
    document.getElementsByClassName('btn btn-outline-info').disabled = false;
    document.getElementsByClassName('btn btn-outline-dark').disabled = true;
}

function reset() {
    stop();
    generation = 0;
    grid = Array2D();
    equality();
}