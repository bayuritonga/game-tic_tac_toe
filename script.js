let currentPlayer = '';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let scoreX = 0;
let scoreO = 0;
let computerSymbol = '';
let playerSymbol = '';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Clear existing board
    for (let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.className = 'w-24 h-24 flex items-center justify-center text-4xl font-bold border border-gray-300 cursor-pointer transition-transform duration-300 transform hover:scale-105';
        square.id = i;
        square.addEventListener('click', () => handleClick(i));
        boardElement.appendChild(square);
    }
}

function handleClick(index) {
    if (gameActive && board[index] === '' && currentPlayer === playerSymbol) {
        board[index] = playerSymbol;
        const square = document.getElementById(index);
        square.innerText = playerSymbol;

        square.classList.add('scale-110');
        setTimeout(() => {
            square.classList.remove('scale-110');
        }, 300);

        checkWinner();
        if (gameActive) {
            currentPlayer = computerSymbol;
            setTimeout(computerMove, 500);
        }
    }
}

function checkWinner() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            document.getElementById('status').innerText = `${board[a]} Menang!`;
            updateScore(board[a]);
            return;
        }
    }

    if (!board.includes('')) {
        gameActive = false;
        document.getElementById('status').innerText = "Tidak ada yang menang, Seri!";
    }
}

function updateScore(winner) {
    if (winner === 'X') {
        scoreX++;
        document.getElementById('scoreX').innerText = scoreX;
    } else if (winner === 'O') {
        scoreO++;
        document.getElementById('scoreO').innerText = scoreO;
    }
}

function startGame(symbol) {
    currentPlayer = 'X'; // X always starts
    playerSymbol = symbol;
    computerSymbol = symbol === 'X' ? 'O' : 'X';
    gameActive = true;
    board = ['', '', '', '', '', '', '', '', ''];
    document.getElementById('status').innerText = '';
    document.getElementById('restart').style.display = 'block';
    document.getElementById('board').style.display = 'grid';
    createBoard();

    if (playerSymbol === 'O') {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    if (!gameActive) return;

    let bestScore = -Infinity;
    let possibleMoves = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = computerSymbol;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                possibleMoves = [i];
            } else if (score === bestScore) {
                possibleMoves.push(i);
            }
        }
    }

    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    board[move] = computerSymbol;
    const square = document.getElementById(move);
    square.innerText = computerSymbol;

    square.classList.add('scale-110');
    setTimeout(() => {
        square.classList.remove('scale-110');
    }, 300);

    checkWinner();
    if (gameActive) {
        currentPlayer = playerSymbol;
    }
}

function minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
    const scores = { X: -10, O: 10, tie: 0 };

    // Cek apakah ada pemenang
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Jika X menang, beri penghargaan lebih besar untuk kemenangan lebih cepat
            return board[a] === computerSymbol ? scores[computerSymbol] - depth : scores[playerSymbol] + depth;
        }
    }

    // Cek apakah ada seri
    if (!board.includes('')) {
        return scores['tie'];
    }

    // Jika maximizing (komputer yang bermain)
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = computerSymbol;
                let score = minimax(board, depth + 1, false, alpha, beta);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break; // Alpha-Beta pruning
            }
        }
        return bestScore;
    } else {
        // Jika minimizing (pemain yang bermain)
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = playerSymbol;
                let score = minimax(board, depth + 1, true, alpha, beta);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break; // Alpha-Beta pruning
            }
        }
        return bestScore;
    }
}

document.getElementById('selectX').addEventListener('click', () => startGame('X'));
document.getElementById('selectO').addEventListener('click', () => startGame('O'));
document.getElementById('restart').addEventListener('click', () => {
    gameActive = false;
    document.getElementById('status').innerText = '';
    document.getElementById('restart').style.display = 'none';
    createBoard();
});

createBoard();