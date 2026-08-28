const token = Object.freeze({
    X: "X",
    O: "O"
});

const gameResult = Object.freeze({
    None: 0,
    Tie: 1,
    Player1: 2,
    Player2: 3
});

function createPlayer(name, token) {
    const getName = () => name;
    const getToken = () => token;

    return {
        getName,
        getToken
    };
}

const gameboard = (() => {
    let board = Array(9).fill(null);

    const setTokenAtIndex = (token, index) => {
        if (index < 0 || index >= board.length) return;
        if (board[index] !== null) return;

        board[index] = token;
    };

    const getBoard = () => [...board];

    const isBoardFull = () => board.every(value => value !== null);

    const getBoardFillLevel = () => board.filter(value => value !== null).length;

    const resetBoard = () => {
        board = Array(9).fill(null);
    };

    return {
        setTokenAtIndex,
        getBoard,
        isBoardFull,
        getBoardFillLevel,
        resetBoard
    };
})();

function createGameController(gameboard, player1, player2) {
    const winPositions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const hasTie = () => gameboard.isBoardFull();

    const hasWinner = () => {
        const board = gameboard.getBoard();
        return winPositions.some(([a, b, c]) =>
            board[a] !== null && board[a] === board[b] && board[b] === board[c]
        );
    };

    const getGameResult = () => {
        if (hasWinner()) {
            return gameboard.getBoardFillLevel() % 2 !== 0
                ? gameResult.Player1
                : gameResult.Player2;
        }

        if (hasTie()) {
            return gameResult.Tie;
        }

        return gameResult.None;
    };

    const playRound = (index) => {
        if (getGameResult() !== gameResult.None) return;

        const currentPlayer = gameboard.getBoardFillLevel() % 2 === 0 ? player1 : player2;
        gameboard.setTokenAtIndex(currentPlayer.getToken(), index);
    };

    return {
        playRound,
        getGameResult
    };
}

const displayController = (() => {
    const boardContainer = document.querySelector(".board-container");
    const form = document.querySelector(".players-form");
    const statusEl = document.querySelector(".game-status");
    const restartBtn = document.querySelector(".restart-btn");

    let gameController = null;
    let players = [];

    function init() {
        form.addEventListener("submit", handleFormSubmit);
        restartBtn.addEventListener("click", handleRestart);
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const entries = Object.fromEntries(formData);

        players = [
            createPlayer(entries.player1 || "Player 1", token.X),
            createPlayer(entries.player2 || "Player 2", token.O)
        ];

        toggleFormInputs(true);
        startNewGame();
    }

    function startNewGame() {
        gameboard.resetBoard();
        gameController = createGameController(gameboard, players[0], players[1]);
        statusEl.textContent = "";
        restartBtn.style.display = "none";
        renderBoard();
    }

    function handleRestart() {
        startNewGame();
    }

    function toggleFormInputs(disabled) {
        const inputs = form.querySelectorAll("input, button");
        inputs.forEach(input => input.disabled = disabled);
    }

    function disableBoard() {
        const buttons = boardContainer.querySelectorAll("button");
        buttons.forEach(button => button.disabled = true);
    }

    function renderBoard() {
        removeAllChildren(boardContainer);
        const board = gameboard.getBoard();

        board.forEach((cellToken, index) => {
            const button = document.createElement("button");
            button.classList.add("cell");
            button.textContent = cellToken ?? "";

            if (cellToken !== null) button.disabled = true;

            button.addEventListener("click", () => {
                gameController.playRound(index);
                renderBoard();
            });

            boardContainer.appendChild(button);
        });

        checkGameStatus();
    }

    function checkGameStatus() {
        const result = gameController.getGameResult();

        if (result === gameResult.None) return;

        disableBoard();
        restartBtn.style.display = "block";

        if (result === gameResult.Tie) {
            statusEl.textContent = "It's a tie!";
        } else if (result === gameResult.Player1) {
            statusEl.textContent = `${players[0].getName()} wins!`;
        } else if (result === gameResult.Player2) {
            statusEl.textContent = `${players[1].getName()} wins!`;
        }
    }

    init();
})();

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}