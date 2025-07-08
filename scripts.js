const gameDisplay = document.querySelector("#game-board");
const newGameModal = document.querySelector("dialog");
const startGameButton = document.querySelector("#activate-game");
const restartGameButton = document.querySelector("#restart");
const player1NameInput = document.querySelector("#player-1-name");
const player2NameInput = document.querySelector("#player-2-name");
const output = document.querySelector('#output');
/**
 * 
 * @param {string} playerToken 'X' or 'O' determined by player order.
 * @param {string} playerName  Provided by user input
 * @returns 
 */
function Player(token, name) {
    token, name
    let points = 0;
    const getToken = () => token;
    const getName = () => name;
    const promptTurn = () => `${name} will mark a space`;
    const gameOverMessage = () => `${name} won the game!`;
    const getPoints = () => points;
    const resetPoints = () => points = 0;
    const addPoint = () => point++;

    return {getToken, getName, promptTurn, gameOverMessage, getPoints, resetPoints, addPoint};
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
        
        const getToken = () => token;

        const updateToken = (playerToken) => {
            token = playerToken;
        };
        
        return {location, getToken, updateToken};
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

const GameController = (function (player1, player2) {
    player1, player2
    let turnPlayer = player1, boardController = Gameboard(), board = boardController.board, emptyCells = boardController.getEmptyCells();
    let turn = 1;

    const getTurnPlayerToken = () => turnPlayer.getToken();
    const getTurnPlayerName = () => turnPlayer.getName();
    const promptTurnPlayer = () => turnPlayer.promptTurn();
    const displayWinner = () => turnPlayer.gameOverMessage();
    const getBoard = () => board;

    const setTurnPlayer = (string) => {
        if (string === 'switch') {
            turnPlayer = turnPlayer === player1 ? player2 : player1;
        }
        else {
            turnPlayer = player1;
        }
    };

    const dropToken = (row, column) => {
        const cell = board[row][column];
        cell.updateToken(getTurnPlayerToken());
        emptyCells.splice(emptyCells.indexOf(cell.location),1);
    };

    const checkBoardWinState = (player) => {
        const win = player.getToken().repeat(3);
        const horizontal1 = board[0][0].getToken() + board[0][1].getToken() + board[0][2].getToken();
        const horizontal2 = board[1][0].getToken() + board[1][1].getToken() + board[1][2].getToken();
        const horizontal3 = board[2][0].getToken() + board[2][1].getToken() + board[2][2].getToken();
        const vertical1 = board[0][0].getToken() + board[1][0].getToken() + board[2][0].getToken();
        const vertical2 = board[0][1].getToken() + board[1][1].getToken() + board[2][1].getToken();
        const vertical3 = board[0][2].getToken() + board[1][2].getToken() + board[2][2].getToken();
        const diagonal1 = board[0][0].getToken() + board[1][1].getToken() + board[2][2].getToken();
        const diagonal2 = board[2][0].getToken() + board[1][1].getToken() + board[0][2].getToken();

        if (win === horizontal1 
            || win === horizontal2 
            || win === horizontal3 
            || win === vertical1
            || win === vertical2
            || win === vertical3
            || win === diagonal1
            || win === diagonal2) return player;

        return false;
    };

    
    const playTurn = (row, column) => {
        dropToken(row, column);
        if (turn > 4) {            
            if (checkBoardWinState(turnPlayer)) {
                GameDOMController.displayOutput(displayWinner());
                GameDOMController.displayInactiveBoard();
                turn = 1;
                setTurnPlayer('initial');
                return
            }
            else {
                if (turn >= 9) {
                    GameDOMController.displayOutput(`It's a tie!`);
                    GameDOMController.displayInactiveBoard();
                    turn = 1;
                    setTurnPlayer('initial');
                    return
                } 
            }
        }
        turn++;
        setTurnPlayer('switch');
        GameDOMController.displayOutput(promptTurnPlayer());
        GameDOMController.displayActiveBoard();
    };



    return {getTurnPlayerToken, getTurnPlayerName, promptTurnPlayer, displayWinner, dropToken, getBoard, playTurn, boardController};
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

    const displayActiveBoard = () => {
        gameDisplay.classList.remove('inactive');
        gameDisplay.innerHTML = createBoardDisplay();
        const emptyCells = boardController.getEmptyCells();
        emptyCells.forEach(cell => {
            const cellDOM = document.querySelector(`#${cell}`);
            cellDOM.classList.add('clickable-cell');
            cellDOM.addEventListener('click', () => game.playTurn(cellDOM.dataset.row,cellDOM.dataset.column));
        });
        restartGameButton.hidden = true;
    };

    const displayInactiveBoard = () => {
        gameDisplay.classList.add('inactive');
        gameDisplay.innerHTML = createBoardDisplay();
        restartGameButton.hidden = false;
    };

    const validateInputs = () => {
        if (player1NameInput.value.length < 1 | player2NameInput.value.length < 1) {
            document.querySelector("#invalid-input").hidden = false;
            return false;
        }
        return true;
    };

    const displayOutput = (string) => {
        output.textContent = string;
        output.hidden = false;
    };

    function startGame(event) {
        event.preventDefault();

        if (validateInputs()) {
            document.querySelector("#invalid-input").hidden = true;
            game = GameController(Player('X', player1NameInput.value), Player('O', player2NameInput.value));
            boardController = game.boardController;
            board = boardController.board;

            displayOutput(game.promptTurnPlayer());
            displayActiveBoard();

            gameDisplay.classList.remove("start-game");
            gameDisplay.classList.add("game");
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

    restartGameButton.addEventListener("click", displayNewGameSettings);

    displayNewGameScreen();

    return {displayActiveBoard, displayInactiveBoard, displayOutput};
})();

