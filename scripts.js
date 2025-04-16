const gameDisplay = document.querySelector("#game-board");
const newGameModal = document.querySelector("dialog");
const startGameButton = document.querySelector("#activate-game");
/**
 * 
 * @param {string} playerToken 'X' or 'O' determined by player order.
 * @param {string} playerName  Provided by user input
 * @returns 
 */
function Player(playerToken, playerName) {
    const token = playerToken; 
    const name = playerName;

    const getToken = () => token;
    const promptTurn = () => `${name} will mark a space`;
    const winningMessage = () => `${name} won the game!`;
    return {getToken, promptTurn, winningMessage};
};

const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];
    const emptycells = [];
    const getBoard = () => board;
    const getEmptyCells = () => emptycells;

    function Cell(row, column) {
        const location = `cell-${row}-${column}`;
        let token = ' ';
        let isEmpty = true;
        
        const getToken = () => token;

        //Called when an empty cell is clicked
        const updateToken = (playerToken) => {
            token = playerToken;
            isEmpty = false;
        };
        
        return {location, isEmpty, getToken, updateToken};
    };

    const initializeBoard = () => {
        for (let row = 0; row < rows; row++) {
            board[row] = [];
            for (let column = 0; column < columns; column++) {
                const cell = Cell(row,column)
                board[row][column] = cell;
                emptycells.push(cell.location);
            }
        }
    };
    
    return {initializeBoard, getBoard, Cell, getEmptyCells};
})();

const GameController = (function (player1Name,player2Name,rounds) {
    const player1 = Player('X', player1Name);
    const player2 = Player('O', player2Name);
    const totalRounds = rounds;
    const board = Gameboard.getBoard();
    const emptycells = Gameboard.getEmptyCells();
    let turnPlayer = player1;
    let round = 1;
    let turn = 1;
    let gameOver = false;

    const getTurnPlayerToken = () => turnPlayer.getToken();

    const switchPlayer = () => {
        turnPlayer = turnPlayer === player1 ? player2 : player1;
    };

    const dropToken = (row, column, player) => {
        const cell = board[row][column];
        if (cell.isEmpty) {
            cell.updateToken(getTurnPlayerToken());
            emptycells.splice(emptycells.indexOf(cell.location),1);
            GameDOMController.displayBoard();
            switchPlayer();
            return true        
        }
        else {
            console.warn('IMPOSSIBLE MOVE!');
            return false;
        }
    };

    // const getWinner = () => {
    //     const player1Wins = 'XXX';
    //     const player2Wins = 'OOO';
    //     const horizontal1 = board[0].join('');
    //     const horizontal2 = board[1].join('');
    //     const horizontal3 = board[2].join('');
    //     const vertical1 = board[0][0] + board[1][0] + board[2][0];
    //     const vertical2 = board[0][1] + board[1][1] + board[2][1];
    //     const vertical3 = board[0][2] + board[1][2] + board[2][2];
    //     const diagonal1 = board[0][0] + board[1][1] + board[2][2];
    //     const diagonal2 = board[2][0] + board[1][1] + board[0][2];

    //     if( player1Wins === horizontal1 
    //         || player1Wins === horizontal2 
    //         || player1Wins === horizontal3 
    //         || player1Wins === vertical1
    //         || player1Wins === vertical2
    //         || player1Wins === vertical3
    //         || player1Wins === diagonal1
    //         || player1Wins === diagonal2
    //     ) return 'X';

    //     if( player2Wins === horizontal1 
    //         || player2Wins === horizontal2 
    //         || player2Wins === horizontal3 
    //         || player2Wins === vertical1
    //         || player2Wins === vertical2
    //         || player2Wins === vertical3
    //         || player2Wins === diagonal1
    //         || player2Wins === diagonal2
    //     ) return 'O';

    //     return false;
    // };

   

    const restartGame = () => {
        Gameboard.initializeBoard();
        turn = 1;
        round = 1;
        gameOver = false;
    };

    return {restartGame, getTurnPlayerToken, dropToken};
})();

const GameDOMController = (function () {
    const board = Gameboard.getBoard();
    const emptycells = Gameboard.getEmptyCells();

    const displayBoard = () => {
        let currentBoard = "";

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = board[i][j];
                currentBoard +=`<div class="game-cell" id="cell-${i}-${j}" data-row="${i}" data-column="${j}"><p class="player-token">${cell.getToken()}</p></div>`;
            }
        }

        gameDisplay.innerHTML = currentBoard;

        emptycells.forEach(cell => {
            const cellDOM = document.querySelector(`#${cell}`);
            cellDOM.classList.add('clickable-cell');
            cellDOM.addEventListener('click', () => GameController.dropToken(cellDOM.dataset.row,cellDOM.dataset.column,GameController.getTurnPlayerToken()));
        });
    };

    startGameButton.addEventListener("click", (e) => {
        e.preventDefault();
        Gameboard.initializeBoard();
        displayBoard();
        gameDisplay.classList.remove("inactive-game");
        gameDisplay.classList.add("active-game");
        newGameModal.close();
        gameDisplay.removeEventListener('click', displayNewGameSettings);
    });

    const displayNewGameSettings = () => newGameModal.showModal();

    const displayNewGameScreen = () => {
        gameDisplay.addEventListener("click", displayNewGameSettings);
    };

    displayNewGameScreen();

    return {displayBoard};
})();

