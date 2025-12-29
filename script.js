const tokens = Object.freeze({ x: 'X', o: 'O' });

function createPlayer({ name = '', token = '' } = {}) {
    let playerName = name;
    return {
        getName: () => playerName,
        setName: newName => playerName = newName,
        getToken: () => token,
    };
}

function createGameController(playerOne, playerTwo) {
    const board = Array(9).fill(null);
    const WIN_LINES = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    let winner = null;

    function getCurrentPlayer() {
        return board.filter(e => e !== null).length % 2 === 0 ? playerOne : playerTwo;
    }

    function checkWinner(player) {
        if (WIN_LINES.some(line => line.every(i => board[i] === player.getToken()))) {
            winner = player;
        }
    }

    function playRound(position) {
        if (winner || position < 0 || position >= board.length || board[position]) return;

        const player = getCurrentPlayer();
        board[position] = player.getToken();
        checkWinner(player);
    }

    function resetGame() {
        board.fill(null);
        winner = null;
    }

    function getPlayers() {
        return { playerOne, playerTwo };
    }

    function setPlayersNames(nameOne, nameTwo) {
        playerOne.setName(nameOne);
        playerTwo.setName(nameTwo);
    }

    return Object.freeze({
        playRound,
        getCurrentPlayer,
        getPlayers,
        setPlayersNames,
        resetGame,
        getBoard: () => Object.freeze([...board]),
        getWinner: () => Object.freeze(winner),
        isGameOnGoing: () => board.some(e => e === null)
    });
}

function createDisplayController(document, gameController) {
    const boardElement = document.querySelector('.gameboard');
    const resultElement = document.querySelector('.result');

    function renderBoard() {
        boardElement.textContent = null;
        const board = gameController.getBoard();
        const currentPlayer = gameController.getCurrentPlayer();
        const winner = gameController.getWinner();

        if (winner) {
            resultElement.textContent = `${winner.getName()} wins!`;
        } else if (!gameController.isGameOnGoing()) {
            resultElement.textContent = 'Tie!';
        } else {
            resultElement.textContent = `${currentPlayer.getName()}'s turn`;
        }

        for (let i = 0; i < board.length; i++) {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = board[i];
            buttonElement.addEventListener('click', _ => {
                gameController.playRound(i);
                renderBoard();
            });
            boardElement.appendChild(buttonElement);
        }
    }

    function setupResetGame() {
        const resetButton = document.querySelector('.reset');
        resetButton.addEventListener('click', _ => {
            gameController.resetGame();
            renderBoard();
        });
    }

    function setupEditPlayersDialog() {
        const editPlayersElement = document.querySelector('.edit-players');
        const dialogElement = document.querySelector('.dialog');
        const playerOneField = document.querySelector('#player-one');
        const playerTwoField = document.querySelector('#player-two');
        editPlayersElement.addEventListener('click', _ => {
            const players = gameController.getPlayers();
            playerOneField.value = players.playerOne.getName();
            playerTwoField.value = players.playerTwo.getName();
            dialogElement.showModal();
        });
    }

    function setupDialogClose() {
        const closeDialogButtonElement = document.querySelector('.dialog-close');
        const dialogElement = document.querySelector('.dialog');
        closeDialogButtonElement.addEventListener('click', _ => dialogElement.close());
    }

    function setupEditPlayersName() {
        const dialogElement = document.querySelector('.dialog');
        const dialogFormElement = document.querySelector('#players-form');
        const playerOneField = document.querySelector('#player-one');
        const playerTwoField = document.querySelector('#player-two');
        dialogFormElement.addEventListener('submit', e => {
            e.preventDefault();
            gameController.setPlayersNames(playerOneField.value, playerTwoField.value);
            dialogElement.close();
            renderBoard();
        });
    }

    setupEditPlayersDialog();
    setupDialogClose();
    setupEditPlayersName();
    setupResetGame();
    renderBoard();
}

const playerOne = createPlayer({ name: 'Player One', token: tokens.x });
const playerTwo = createPlayer({ name: 'Player Two', token: tokens.o });
const gameController = createGameController(playerOne, playerTwo);
const displayController = createDisplayController(document, gameController);
