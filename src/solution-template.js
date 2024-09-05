let board = [];
let bombCount = 0;
let squaresLeft = 0;
let bombProbability = 3;
let maxProbability = 15;
let gameBoardElement = document.getElementById('gameBoard');

document.getElementById('newGame').addEventListener('click', () => {
    let difficulty = document.getElementById('difficulty').value;
    bombProbability = parseInt(document.getElementById('bombProb').value);
    maxProbability = parseInt(document.getElementById('maxProb').value);
    setupGame(difficulty);
});

function setupGame(difficulty) {
    let rows, cols;

    switch (difficulty) {
        case 'easy':
            rows = 9;
            cols = 9;
            break;
        case 'medium':
            rows = 16;
            cols = 16;
            break;
        case 'hard':
            rows = 16;
            cols = 30;
            break;
    }

    createBoard(rows, cols);
    renderBoard(rows, cols);
}

function createBoard(rows, cols) {
    board = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            let hasBomb = Math.random() * maxProbability < bombProbability;
            row.push(new BoardSquare(hasBomb, 0));
        }
        board.push(row);
    }

    calculateBombsAround(rows, cols);
}

function calculateBombsAround(rows, cols) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let bombsAround = 0;
            if (!board[i][j].hasBomb) {
                bombsAround = countNeighboringBombs(i, j);
            }
            board[i][j].bombsAround = bombsAround;
        }
    }
}

function countNeighboringBombs(row, col) {
    let bombs = 0;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < board.length && j >= 0 && j < board[0].length && board[i][j].hasBomb) {
                bombs++;
            }
        }
    }
    return bombs;
}

function renderBoard(rows, cols) {
    gameBoardElement.innerHTML = '';
    gameBoardElement.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    gameBoardElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => handleCellClick(i, j));
            gameBoardElement.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    let cell = board[row][col];
    let cellElement = gameBoardElement.children[row * board[0].length + col];

    if (cell.hasBomb) {
        cellElement.classList.add('bomb');
        alert('Game Over!');
    } else {
        cellElement.textContent = cell.bombsAround || '';
        squaresLeft--;
        if (squaresLeft === bombCount) {
            alert('You win!');
        }
    }
}

class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
        this.isRevealed = false;
        this.isFlagged = false;
    }
}
