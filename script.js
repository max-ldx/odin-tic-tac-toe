const tokens = Object.freeze({ x: 'X', o: 'O' });

const createPlayer = ({ name = '', token = '' } = {}) => Object.freeze({ name, token });

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
        if (WIN_LINES.some(line => line.every(i => board[i] === player.token))) {
            winner = player;
        }
    };

    const playRound = position => {
        if (winner || position < 0 || position >= board.length || board[position]) return;

        const player = getCurrentPlayer();
        board[position] = player.token;
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
