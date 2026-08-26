const Tokens = Object.freeze({
    X: "X",
    O: "O"
});

function createPlayer(name, token) {
    const getName = () => name;

    const getToken = () => token;

    return {
        getName,
        getToken
    }
}

const gameboard = (() => {
    const board = [null, null, null, null, null, null, null, null, null];

    const getBoard = () => [...board];

    const tryPlaceToken = (token, index) => {
        if (index < 0 || index > board.length - 1) return false;
        if (board[index] !== null) return false;

        board[index] = token;
        return true;
    };

    const isBoardFull = () => board.every(value => value !== null);

    const getBoardFillLevel = () => board.filter(value => value !== null).length;

    return {
        getBoard,
        tryPlaceToken,
        isBoardFull,
        getBoardFillLevel
    }
})();

const player1 = createPlayer("Player 1", Tokens.X);
const player2 = createPlayer("Player 2", Tokens.O);

function createGameController(player1, player2, gameboard) {
    const winPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const getCurrentPlayer = () => gameboard.getBoardFillLevel() % 2 === 0 ? player1 : player2;

    const checkHasWinner = () => {
        const board = gameboard.getBoard();

        for (const winPosition of winPositions) {
            if (board[winPosition[0]] !== null &&
                board[winPosition[0]] === board[winPosition[1]] &&
                board[winPosition[1]] === board[winPosition[2]]) {
                return true;
            }
        }

        return false;
    }

    const hasTie = () => gameboard.isBoardFull();

    const playRound = (index) => {
        if (checkHasWinner() || hasTie()) return;
        const result = gameboard.tryPlaceToken(getCurrentPlayer().getToken(), index);
    }

    return {
        checkHasWinner,
        hasTie,
        playRound
    }
}

const gameController = createGameController(player1, player2, gameboard);

gameController.playRound(0);
console.log(gameboard.getBoard());
gameController.playRound(3);
console.log(gameboard.getBoard());
gameController.playRound(1);
console.log(gameboard.getBoard());
gameController.playRound(4);
console.log(gameboard.getBoard());
gameController.playRound(2);
console.log(gameboard.getBoard());
gameController.playRound(5);
console.log(gameboard.getBoard());
console.log(gameController.checkHasWinner())