const gameDisplay = document.querySelector("#game-board");
const newGameModal = document.querySelector("dialog");
const startGameButton = document.querySelector("#activate-game");

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

    const getBoard = () => board;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(' ');
        }
    }

    const dropToken = (row, column, player) => {
        if (board[row][column] !== ' ') {
            return false;
        }
        else {
            board[row][column] = player.getToken();
            return true;
        }
    };
    
    const clearBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = ' ';
            }
        }
    };

    const getWinner = () => {
        const player1Wins = 'XXX';
        const player2Wins = 'OOO';
        const horizontal1 = board[0].join('');
        const horizontal2 = board[1].join('');
        const horizontal3 = board[2].join('');
        const vertical1 = board[0][0] + board[1][0] + board[2][0];
        const vertical2 = board[0][1] + board[1][1] + board[2][1];
        const vertical3 = board[0][2] + board[1][2] + board[2][2];
        const diagonal1 = board[0][0] + board[1][1] + board[2][2];
        const diagonal2 = board[2][0] + board[1][1] + board[0][2];

        if( player1Wins === horizontal1 
            || player1Wins === horizontal2 
            || player1Wins === horizontal3 
            || player1Wins === vertical1
            || player1Wins === vertical2
            || player1Wins === vertical3
            || player1Wins === diagonal1
            || player1Wins === diagonal2
        ) return 'X';

        if( player2Wins === horizontal1 
            || player2Wins === horizontal2 
            || player2Wins === horizontal3 
            || player2Wins === vertical1
            || player2Wins === vertical2
            || player2Wins === vertical3
            || player2Wins === diagonal1
            || player2Wins === diagonal2
        ) return 'O';

        return false;
    };

    return {dropToken, clearBoard, getBoard, getWinner};
})();

const GameController = (function (player1Name,player2Name,rounds) {
    const player1 = Player('X', player1Name);
    const player2 = Player('O', player2Name);
    const totalRounds = rounds;
    let turnPlayer = player1;
    let round = 1;
    let turn = 1;
    let gameOver = false;

    const switchPlayer = () => {
        turnPlayer = turnPlayer === player1 ? player2 : player1;
    };
    
    const playRound = (row, column) => {
        if (gameOver) {
            return;
        }

        if(round > 9) {
            gameOver = true;
            return;
        }

        turnPlayer.promptTurn();

        let validTurn = Gameboard.dropToken(row, column, turnPlayer);
        if (validTurn) {
            Gameboard.displayBoard();

            if (Gameboard.getWinner()) {
                gameOver = true;
                turnPlayer.winningMessage();
                return;
            }
            switchPlayer();
            turn++;
        }
    };

    const restartGame = () => {
        Gameboard.clearBoard();
        turn = 1;
        round = 1;
        gameOver = false;
    };

    return {playRound, restartGame};
})();

const GameDOMController = (function () {
    const board = Gameboard.getBoard();

    const displayBoard = () => {
        let currentBoard = "";

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                currentBoard +=`<div class="game-cell" id="cell-${i}-${j}"><p class="player-token">${board[i][j]}</p></div>`;
            }
        }

        gameDisplay.innerHTML = currentBoard;
    };

    const displayNewGameSettings = () => {newGameModal.showModal()};

    startGameButton.addEventListener("click", (e) => {
        e.preventDefault();
        displayBoard();
        gameDisplay.classList.remove("inactive-game");
        gameDisplay.classList.add("active-game");
        newGameModal.close();
    });

    const displayNewGameScreen = () => {
        gameDisplay.addEventListener("click", displayNewGameSettings);

        
    };

    displayNewGameScreen();

    return {displayBoard};
})();

