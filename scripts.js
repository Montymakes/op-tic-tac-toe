const gameDisplay = document.querySelector("#game-board");
const newGameModal = document.querySelector("dialog");
const startGameButton = document.querySelector("#activate-game");
const player1NameInput = document.querySelector("#player-1-name");
const player2NameInput = document.querySelector("#player-2-name");
const roundInput = document.querySelector('input[name="rounds"]');
const output = document.querySelector('#output');
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
    const getName = () => name;
    const promptTurn = () => `${name} will mark a space`;
    const winningMessage = () => `${name} won the game!`;
    return {getToken, getName, promptTurn, winningMessage};
};

const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];
    const emptyCells = [];
    const getEmptyCells = () => emptyCells;

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
                emptyCells.push(cell.location);
            }
        }
    };

    initializeBoard();
    
    return {Cell, getEmptyCells, board};
});

const GameController = (function (player1, player2, rounds) {
    player1, player2, rounds
    let turnPlayer = player1;
    const boardController = Gameboard();
    const board = boardController.board;
    const emptyCells = boardController.getEmptyCells();
    let round = 1;
    let turn = 1;
    let gameOver = false;

    const getTurnPlayerToken = () => turnPlayer.getToken();
    const getTurnPlayerName = () => turnPlayer.getName();
    const promptTurnPlayer = () => turnPlayer.promptTurn();
    const displayWinner = () => turnPlayer.winningMessage();
    const getBoard = () => board;

    const switchPlayer = () => {
        turnPlayer = turnPlayer === player1 ? player2 : player1;
    };

    const dropToken = (row, column, player) => {
        const cell = board[row][column];
        if (cell.isEmpty) {
            cell.updateToken(getTurnPlayerToken());
            emptyCells.splice(emptyCells.indexOf(cell.location),1);
            GameDOMController.displayBoard();
            switchPlayer();
            GameDOMController.promptTurnOutput();
            return true        
        }
        else {
            console.warn('IMPOSSIBLE MOVE!');
            return false;
        }
    };

    return {getTurnPlayerToken, getTurnPlayerName, promptTurnPlayer, displayWinner, dropToken, getBoard, boardController};
});

const GameDOMController = (function () {
    let game, board, boardController;

    const createBoardDisplay = () => {
        let newBoard = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = board[i][j];
                newBoard +=`<div class="game-cell" id="cell-${i}-${j}" data-row="${i}" data-column="${j}"><p class="player-token">${cell.getToken()}</p></div>`;
            }
        }
        return newBoard;
    };

    const displayBoard = () => {
        gameDisplay.innerHTML = createBoardDisplay();
        const emptyCells = boardController.getEmptyCells();
        emptyCells.forEach(cell => {
            const cellDOM = document.querySelector(`#${cell}`);
            cellDOM.classList.add('clickable-cell');
            cellDOM.addEventListener('click', () => game.dropToken(cellDOM.dataset.row,cellDOM.dataset.column,game.getTurnPlayerToken()));
        });
    };

    const validateInputs = () => {
        if (player1NameInput.value.length < 1 | player2NameInput.value.length < 1) {
            document.querySelector("#invalid-input").hidden = false;
            console.warn('invalid input');
            return false;
        }
        return true;
    };

    const promptTurnOutput = () => {
        output.textContent = game.promptTurnPlayer();
        output.hidden = false;
    };

    function startGame(event) {
        event.preventDefault();

        if (validateInputs()) {
            document.querySelector("#invalid-input").hidden = true;
            game = GameController(Player('X', player1NameInput.value), Player('O', player2NameInput.value), Number(roundInput.checked.value));
            boardController = game.boardController;
            board = boardController.board;

            promptTurnOutput();
            displayBoard();

            gameDisplay.classList.remove("inactive-game");
            gameDisplay.classList.add("active-game");
            newGameModal.close();
            gameDisplay.removeEventListener('click', displayNewGameSettings);
        }
    }

    startGameButton.addEventListener("click", (e) => {
       startGame(e);
    });

    const displayNewGameSettings = () => newGameModal.showModal();

    const displayNewGameScreen = () => {
        gameDisplay.addEventListener("click", displayNewGameSettings);
    };

    displayNewGameScreen();

    return {displayBoard, promptTurnOutput};
})();

