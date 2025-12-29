const tokens = Object.freeze({ x: 'X', o: 'O' });

const createPlayer = ({ name = '', token = '' } = {}) => {
    let playerName = name;
    return {
        getName: () => playerName,
        setName: newName => playerName = newName,
        getToken: () => token,
    }
}

const createGameController = (playerOne, playerTwo) => {
    const board = Array(9).fill(null);
    const WIN_LINES = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    let winner = null;

    const getCurrentPlayer = () => board.filter(e => e !== null).length % 2 === 0 ? playerOne : playerTwo;

    const checkWinner = player => {
        if (WIN_LINES.some(line => line.every(i => board[i] === player.getToken()))) {
            winner = player;
        }
    };

    const playRound = position => {
        if (winner || position < 0 || position >= board.length || board[position]) return;

        const player = getCurrentPlayer();
        board[position] = player.getToken();
        checkWinner(player);
    };

    const resetGame = () => {
        board.fill(null);
        winner = null;
    };

    return Object.freeze({
        playRound,
        getCurrentPlayer,
        resetGame,
        getBoard: () => [...board],
        getWinner: () => winner,
        hasRoundsLeft: () => board.some(e => e === null)
    });
};

const createDisplayController = (document, gameController) => {
    const boardElement = document.querySelector('.gameboard');
    const resultElement = document.querySelector('.result');

    const renderBoard = () => {
        boardElement.textContent = null;
        const board = gameController.getBoard();
        const currentPlayer = gameController.getCurrentPlayer();
        const winner = gameController.getWinner();

        if (winner) {
            resultElement.textContent = `${winner.getName()} wins!`;
        } else if (!gameController.hasRoundsLeft()) {
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

    const setupResetGame = () => {
        const resetButton = document.querySelector('.reset');
        resetButton.addEventListener('click', _ => {
            gameController.resetGame();
            renderBoard();
        });
    }

    setupResetGame();
    renderBoard();
}

const playerOne = createPlayer({ name: 'Player One', token: tokens.x });
const playerTwo = createPlayer({ name: 'Player Two', token: tokens.o });
const gameController = createGameController(playerOne, playerTwo);
const displayController = createDisplayController(document, gameController);
