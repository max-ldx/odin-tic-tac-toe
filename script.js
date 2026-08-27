const token = Object.freeze({
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

    const setTokenAtIndex = (token, index) => {
        if (index < 0 || index > board.length - 1) return;
        if (board[index] !== null) return;

        board[index] = token;
    }

    const getBoard = () => [...board];

    const isBoardFull = () => board.every(value => value !== null);

    const getBoardFillLevel = () => board.filter(value => value !== null).length;

    return {
        setTokenAtIndex,
        getBoard,
        isBoardFull,
        getBoardFillLevel
    }
})();

const gameResult = Object.freeze({
    None: 0,
    Tie: 1,
    Player1: 2,
    Player2: 3
})

function createGameController(gameboard, player1, player2) {
    const winPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const hasTie = () => gameboard.isBoardFull();

    const hasWinner = () => {
        const board = gameboard.getBoard();

        for (const winPosition of winPositions) {
            if (board[winPosition[0]] !== null &&
                board[winPosition[0]] === board[winPosition[1]] &&
                board[winPosition[1]] === board[winPosition[2]]
            ) {
                return true;
            }
        }

        return false;
    }

    const getWinner = () => {
        if (hasTie()) return gameResult.Tie;
        if (!hasWinner()) return gameResult.None;
        return (gameboard.getBoardFillLevel() - 1) % 2 === 0 ? gameResult.Player1 : gameResult.Player2;
    }

    const playRound = (index) => {
        if (getWinner() !== gameResult.None) return;

        const currentPlayer = gameboard.getBoardFillLevel() % 2 === 0 ? player1 : player2;
        gameboard.setTokenAtIndex(currentPlayer.getToken(), index);
    }

    return {
        playRound,
        getWinner
    }
}

const player1 = createPlayer("player1", token.X);
const player2 = createPlayer("player2", token.O);
const gameController = createGameController(gameboard, player1, player2);

const displayController = (() => {
    const CELL_COUNT = gameboard.getBoard().length;
    const boardContainer = document.querySelector(".board-container");

    function renderBoard() {
        boardContainer.textContent = null;
        const board = gameboard.getBoard();

        for (let i = 0; i < CELL_COUNT; i++) {
            const button = document.createElement("button");
            button.textContent = board[i];
            button.addEventListener("click", () => {
                gameController.playRound(i);
                renderBoard();
            });
            boardContainer.appendChild(button);
        }
    }

    // Render after players choose their name
    renderBoard();
})();