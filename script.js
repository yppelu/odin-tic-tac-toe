const boardCells = document.querySelectorAll('.game-board__cell');
let playerX, playerO;

(function () {
  const startGameButton = document.querySelector('.header__start-game-button');
  const gameParametersFormWrapper = document.querySelector('.game-parameters-form-wrapper');
  const gameParametersForm = document.querySelector('.game-parameters-form');
  const gameModeFriendRadio = document.querySelector('[data-game-mode="friend"]');
  const gameModeEasyAiRadio = document.querySelector('[data-game-mode="easy-ai"]');
  const gameModeHardAiRadio = document.querySelector('[data-game-mode="hard-ai"]');
  const playerXNameInput = document.querySelector('.game-parameters-form__name-input[name="playerX-name"]');
  const playerONameInput = document.querySelector('.game-parameters-form__name-input[name="playerO-name"]');
  const submitGameParametersButton = document.querySelector('.game-parameters-form__submit-form');
  let chosenGameMode;

  /* Disabled until I make AI logic */
  gameModeEasyAiRadio.setAttribute('disabled', 'disabled');
  gameModeHardAiRadio.setAttribute('disabled', 'disabled');
  /* ------------------------------ */

  startGameButton.addEventListener('click', () => {
    gameParametersFormWrapper.classList.remove('hidden');
  });

  gameModeFriendRadio.onload = chooseGameMode(gameModeFriendRadio);
  gameModeFriendRadio.addEventListener('click', () => {
    chooseGameMode(gameModeFriendRadio);
  });
  gameModeEasyAiRadio.addEventListener('click', () => {
    chooseGameMode(gameModeEasyAiRadio);
  });
  gameModeHardAiRadio.addEventListener('click', () => {
    chooseGameMode(gameModeHardAiRadio);
  });

  submitGameParametersButton.addEventListener('click', (e) => {
    e.preventDefault();

    playerX = createPlayer(playerXNameInput.value, '1');
    playerO = createPlayer(playerONameInput.value, '2');

    gameProcess.startGame(chosenGameMode);
    gameParametersFormWrapper.classList.add('hidden');
    playerONameInput.removeAttribute('readonly');
    gameParametersForm.reset();
  });

  function chooseGameMode(radioButton) {
    radioButton.checked = true;
    if (radioButton === gameModeFriendRadio) {
      playerONameInput.removeAttribute('readonly');
      playerONameInput.value = '';
      chosenGameMode = 'friend';
    } else {
      playerONameInput.setAttribute('readonly', '');
      if (radioButton === gameModeEasyAiRadio) {
        playerONameInput.value = 'Easy AI';
        chosenGameMode = 'easy-ai';
      }
      if (radioButton === gameModeHardAiRadio) {
        playerONameInput.value = 'Hard AI';
        chosenGameMode = 'hard-ai';
      }
    }
  }

  function createPlayer(name, playerNumber) {
    return {
      name: name || `Player ${playerNumber}`,
      score: 0
    }
  }

})();

const gameBoard = (function () {
  const board = [];

  function clearBoard() {
    board.length = 0;
    boardCells.forEach(cell => cell.innerHTML = '');
  }

  function createMarkSvg(markType) {
    const placeholder = document.createElement('template');
    placeholder.innerHTML = (markType === 'X')
      ? '<svg class="game-board__playerMark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="none"><path class="x-line1" stroke="var(--text-clr)" stroke-width="3" stroke-dasharray="50" stroke-dashoffset="-50" stroke-linecap="round" stroke-linejoin="round" d="M7 42.3553L42.3553 7" /><path class="x-line2" stroke="var(--text-clr)" stroke-width="3" stroke-dasharray="50" stroke-dashoffset="50" stroke-linecap="round" stroke-linejoin="round" d="M7 7L42.3553 42.3553" /></svg>'
      : '<svg class="game-board__playerMark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="none"><path class="o-circle" stroke="var(--text-clr)" stroke-width="3" stroke-dasharray="150" stroke-dashoffset="150" d="M9.24891 5.0519L9.24896 5.05196L9.25588 5.04655C11.4238 3.35179 13.9795 2.5 16.9461 2.5C22.6946 2.5 27.7846 3.65422 32.2284 5.94951L32.2283 5.94956L32.2354 5.95308C36.7291 8.18483 40.2104 11.4027 42.6913 15.6118L42.6937 15.6158C45.2266 19.8235 46.5 24.6901 46.5 30.2316C46.5 33.8414 45.3565 36.8422 43.0806 39.2684L43.0805 39.2684L43.0767 39.2726C40.8188 41.7355 38.0348 43.5545 34.7148 44.7286L34.7124 44.7295C31.419 45.913 28.2717 46.5 25.2675 46.5C20.8817 46.5 16.9603 45.4479 13.4899 43.3519C10.0737 41.2562 7.38861 38.2965 5.43484 34.4574C3.48322 30.6226 2.5 26.1868 2.5 21.1368C2.5 17.721 3.08238 14.5964 4.24035 11.7572C5.39499 8.92622 7.06634 6.6972 9.24891 5.0519Z" /></svg>';
    return placeholder.content.firstElementChild;
  }

  function getBoard() {
    return board;
  }

  function renderMark(index) {
    const svg = createMarkSvg(board[index]);
    boardCells[index].append(svg);
  }

  function renderTurn(index, turn) {
    board[index] = (turn % 2 === 0) ? 'X' : 'O';
    renderMark(index);
  }

  function renderWinner(index1, index2, index3) {
    boardCells[index1].firstChild.style.scale = '1.5';
    boardCells[index2].firstChild.style.scale = '1.5';
    boardCells[index3].firstChild.style.scale = '1.5';
  }

  return {
    clearBoard,
    getBoard,
    renderTurn,
    renderWinner
  }
})();

const gameProcess = (function () {
  const nextRoundBlock = document.querySelector('.game-next-round-block');
  const nextRoundBlockTitle = document.querySelector('.game-next-round__title');
  const nextRoundButton = document.querySelector('.game-next-round-block__button');

  let turn = 0;
  const roundWinner = [];

  nextRoundButton.addEventListener('click', startNewRound);

  function checkWinner() {
    const board = gameBoard.getBoard();
    for (let i = 0; i < 7; i++) {
      if (board[i]) {
        if (i === 0 || i === 1 || i === 2) {
          if (board[i] === board[i + 3] && board[i] === board[i + 6]) {
            saveWinner(board[i], i, i + 3, i + 6);
            return true;
          }
        }
        if (i === 0 || i === 3 || i === 6) {
          if (board[i] === board[i + 1] && board[i] === board[i + 2]) {
            saveWinner(board[i], i, i + 1, i + 2);
            return true;
          }
        }
        if (i === 0) {
          if (board[i] === board[i + 4] && board[i] === board[i + 8]) {
            saveWinner(board[i], i, i + 4, i + 8);
            return true;
          }
        }
        if (i === 2) {
          if (board[i] === board[i + 2] && board[i] === board[i + 4]) {
            saveWinner(board[i], i, i + 2, i + 4);
            return true;
          }
        }
      }
    }
    return false;
  }

  function gamePVP() {
    if (checkWinner()) {
      roundWinner[0].score++;
      showWin();
    } else if (turn === 8) {
      showTie();
    }
  }

  function saveWinner(winnerMark, index1, index2, index3) {
    roundWinner[0] = (winnerMark === 'X') ? playerX : playerO;
    [roundWinner[1], roundWinner[2], roundWinner[3]] = [index1, index2, index3];
  }

  function showTie() {
    nextRoundBlockTitle.textContent = 'It is a tie!';
    nextRoundBlock.classList.remove('hidden');
  }

  function showWin() {
    setTimeout(gameBoard.renderWinner, 0, roundWinner[1], roundWinner[2], roundWinner[3]);
    statistics.refreshStatistics();
    nextRoundBlockTitle.textContent = `${roundWinner[0].name} wins!`;
    nextRoundBlock.classList.remove('hidden');
  }

  function startGame(gameMode) {
    startNewRound();
    statistics.refreshStatistics();

    boardCells.forEach((cell, index) => {
      cell.addEventListener('click', () => {
        if (cell.innerHTML === '') {
          gameBoard.renderTurn(index, turn);
          if (gameMode === 'friend') gamePVP();
          ++turn;
        }
      });
    });
  }

  function startNewRound() {
    gameBoard.clearBoard();
    turn = 0;
    if (!nextRoundBlock.classList.contains('hidden')) {
      nextRoundBlock.classList.add('hidden');
    }
  }

  return {
    startGame
  }

})();

const statistics = (function () {
  const playerXName = document.querySelector('.statistics__player-name[data-player="X"]');
  const playerXScore = document.querySelector('.statistics__player-score[data-player="X"]');
  const playerOName = document.querySelector('.statistics__player-name[data-player="O"]');
  const playerOScore = document.querySelector('.statistics__player-score[data-player="O"]');

  function refreshStatistics() {
    playerXName.textContent = playerX.name;
    playerXScore.textContent = playerX.score;
    playerOName.textContent = playerO.name;
    playerOScore.textContent = playerO.score;
  }

  return {
    refreshStatistics
  }
})();