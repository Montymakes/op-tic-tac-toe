function Player(playerToken) {
    const token = playerToken; 
    const name = token === "X" ? "Player 1" : "Player 2";

    const getToken = () => playerToken;
    const promptTurn = () => console.log(`${name} will mark a space`);
    const winningMessage = () => console.log(`${name} won the game!`);
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
            console.log('invalid move');
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

    const displayBoard = () => {
        console.log(
            `   
            row 0: ${board[0][0]}  |  ${board[0][1]}  |  ${board[0][2]}
            row 1: ${board[1][0]}  |  ${board[1][1]}  | ${board[1][2]}
            row 2: ${board[2][0]}  |  ${board[2][1]}  | ${board[2][2]}`
        );
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
    

    return {dropToken, clearBoard, getBoard, displayBoard, getWinner};
})();

const GameController = (function () {
    const player1 = Player('X');
    const player2 = Player('O');
    let turnPlayer = player1;
    let round = 1;
    let gameOver = false;

    console.log('GAME START');
    console.log('----------');

    const switchPlayer = () => {
        turnPlayer = turnPlayer === player1 ? player2 : player1;
    };
    
    const playRound = (row, column) => {
        if (gameOver) {
            console.log('Type GameController.restartGame() to play again!');
            return;
        }

        if(round > 9) {
            gameOver = true;
            console.log("Game over! It's a tie.")
            return;
        }

        turnPlayer.promptTurn();

        let validTurn = Gameboard.dropToken(row, column, turnPlayer);
        if (validTurn) {
            Gameboard.displayBoard();

            if (Gameboard.getWinner()) {
                gameOver = true;
                turnPlayer.winningMessage();
                console.log('Type GameController.restartGame() to play again!');
                return;
            }
            switchPlayer();
            round++;
        }
    };

    const restartGame = () => {
        Gameboard.clearBoard();
        round = 1;
        gameOver = false;
    };

    return {playRound, restartGame};
})();