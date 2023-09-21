// GLOBAL VARIABLES
const AMOUNT_OF_CELLS = 9;
const boardCells = Array.from(document.querySelectorAll('.game-board__cell'));
let playerX, playerO;

// FORM MODULE
(function () {
  const startGameButton = document.querySelector('.header__start-game-button');
  const gameParametersFormWrapper = document.querySelector('.game-parameters-form-wrapper');
  const gameParametersForm = document.querySelector('.game-parameters-form');
  const gameModeFriendRadio = document.querySelector('[data-game-mode="friend"]');
  const gameModeEasyAIRadio = document.querySelector('[data-game-mode="easy-ai"]');
  const gameModeHardAIRadio = document.querySelector('[data-game-mode="hard-ai"]');
  const playerXNameInput = document.querySelector('.game-parameters-form__name-input[name="playerX-name"]');
  const playerONameInput = document.querySelector('.game-parameters-form__name-input[name="playerO-name"]');
  const playerMarkChoiceForm = document.querySelector('.game-parameters-form__player-mark-fieldset');
  const playerMarkXRadio = document.querySelector('[data-player-mark="X"]');
  const playerMarkORadio = document.querySelector('[data-player-mark="O"]');
  const submitGameParametersButton = document.querySelector('.game-parameters-form__submit-form');

  let chosenGameMode;

  function applyDefaultToNameInputs() {
    if (playerXNameInput.value === '') playerXNameInput.value = 'Player X';
    if (playerONameInput.value === '') playerONameInput.value = 'Player O';
  }

  function assignIsMoveToPlayer(playerNameInput) {
    if (playerNameInput === playerXNameInput) return true;
    if (playerNameInput === playerONameInput) return false;
  }

  function chooseAIGameMode(gameModeRadio) {
    if (gameModeRadio === gameModeEasyAIRadio) chosenGameMode = 'easy-ai';
    if (gameModeRadio === gameModeHardAIRadio) chosenGameMode = 'hard-ai';
    selectAI();
    if (playerMarkChoiceForm.classList.contains('hidden')) {
      playerMarkChoiceForm.classList.remove('hidden');
    }
  }

  function chooseFriendGameMode() {
    chosenGameMode = 'friend';
    clearAISelection();
    if (!playerMarkChoiceForm.classList.contains('hidden')) {
      playerMarkChoiceForm.classList.add('hidden');
    }
  }

  function chooseGameMode(gameModeRadio) {
    gameModeRadio.checked = true;
    if (gameModeRadio === gameModeFriendRadio) chooseFriendGameMode();
    else chooseAIGameMode(gameModeRadio);
  }

  function clearAISelection() {
    if (playerXNameInput.hasAttribute('readonly')) {
      playerXNameInput.removeAttribute('readonly');
      playerXNameInput.value = '';
    }
    if (playerONameInput.hasAttribute('readonly')) {
      playerONameInput.removeAttribute('readonly');
      playerONameInput.value = '';
    }
  }

  function createPlayer(playerNameInput, isAI = false) {
    if (!playerNameInput.value) applyDefaultToNameInputs();
    return {
      name: playerNameInput.value,
      isAI,
      isMove: assignIsMoveToPlayer(playerNameInput),
      wins: 0
    };
  }

  function createPlayers() {
    if (playerXNameInput.hasAttribute('readonly')) {
      playerX = createPlayer(playerXNameInput, true);
      playerO = createPlayer(playerONameInput);
    } else if (playerONameInput.hasAttribute('readonly')) {
      playerX = createPlayer(playerXNameInput);
      playerO = createPlayer(playerONameInput, true);
    } else {
      playerX = createPlayer(playerXNameInput);
      playerO = createPlayer(playerONameInput);
    }
  }

  function resetGameParametersForm() {
    gameParametersForm.reset();
    chooseGameMode(gameModeFriendRadio);
  }

  function selectAI() {
    clearAISelection();
    if (playerMarkXRadio.checked) setInputToAI(playerONameInput);
    if (playerMarkORadio.checked) setInputToAI(playerXNameInput);
  }

  function setInputToAI(playerInputToSet) {
    playerInputToSet.setAttribute('readonly', '');
    if (chosenGameMode === 'easy-ai') playerInputToSet.value = 'Easy AI';
    if (chosenGameMode === 'hard-ai') playerInputToSet.value = 'Hard AI';
  }

  resetGameParametersForm();

  startGameButton.addEventListener('click', () => {
    resetGameParametersForm();
    gameParametersFormWrapper.classList.remove('hidden');
  });

  gameModeFriendRadio.addEventListener('click', () => {
    chooseGameMode(gameModeFriendRadio);
  });
  gameModeEasyAIRadio.addEventListener('click', () => {
    chooseGameMode(gameModeEasyAIRadio);
  });
  gameModeHardAIRadio.addEventListener('click', () => {
    chooseGameMode(gameModeHardAIRadio);
  });

  playerMarkXRadio.addEventListener('click', () => {
    if (gameModeEasyAIRadio.checked) chooseGameMode(gameModeEasyAIRadio);
    if (gameModeHardAIRadio.checked) chooseGameMode(gameModeHardAIRadio);
  });
  playerMarkORadio.addEventListener('click', () => {
    if (gameModeEasyAIRadio.checked) chooseGameMode(gameModeEasyAIRadio);
    if (gameModeHardAIRadio.checked) chooseGameMode(gameModeHardAIRadio);
  });

  submitGameParametersButton.addEventListener('click', (e) => {
    e.preventDefault();
    createPlayers();
    statistics.refreshStatistics();
    gameProcess.startGame(chosenGameMode);
    gameParametersFormWrapper.classList.add('hidden');
  });
})();

// GAME BOARD MODULE
const gameBoard = (function () {
  const board = [];
  for (let i = 0; i < AMOUNT_OF_CELLS; i++) board[i] = '';

  function addMove(index) {
    if (playerX.isMove) board[index] = 'X';
    if (playerO.isMove) board[index] = 'O';
    renderMove(index);
  }

  function checkIfMovePossible(index) {
    return board[index] ? false : true;
  }

  function clearBoard() {
    for (let i = 0; i < AMOUNT_OF_CELLS; i++) board[i] = '';
    boardCells.forEach(cell => cell.innerHTML = '');
  }

  function createMarkSvg(markType) {
    const placeholder = document.createElement('template');
    placeholder.innerHTML = (markType === 'X')
      ? '<svg class="game-board__playerMark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="none"><path class="x-line1" stroke="var(--text-clr)" stroke-width="3" stroke-dasharray="50" stroke-dashoffset="-50" stroke-linecap="round" stroke-linejoin="round" d="M7 42.3553L42.3553 7" /><path class="x-line2" stroke="var(--text-clr)" stroke-width="3" stroke-dasharray="50" stroke-dashoffset="50" stroke-linecap="round" stroke-linejoin="round" d="M7 7L42.3553 42.3553" /></svg>'
      : '<svg class="game-board__playerMark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="none"><path class="o-circle" stroke="var(--text-clr)" stroke-width="3" stroke-dasharray="150" stroke-dashoffset="150" d="M9.24891 5.0519L9.24896 5.05196L9.25588 5.04655C11.4238 3.35179 13.9795 2.5 16.9461 2.5C22.6946 2.5 27.7846 3.65422 32.2284 5.94951L32.2283 5.94956L32.2354 5.95308C36.7291 8.18483 40.2104 11.4027 42.6913 15.6118L42.6937 15.6158C45.2266 19.8235 46.5 24.6901 46.5 30.2316C46.5 33.8414 45.3565 36.8422 43.0806 39.2684L43.0805 39.2684L43.0767 39.2726C40.8188 41.7355 38.0348 43.5545 34.7148 44.7286L34.7124 44.7295C31.419 45.913 28.2717 46.5 25.2675 46.5C20.8817 46.5 16.9603 45.4479 13.4899 43.3519C10.0737 41.2562 7.38861 38.2965 5.43484 34.4574C3.48322 30.6226 2.5 26.1868 2.5 21.1368C2.5 17.721 3.08238 14.5964 4.24035 11.7572C5.39499 8.92622 7.06634 6.6972 9.24891 5.0519Z" /></svg>';
    return placeholder.content.firstElementChild;
  }

  function renderMove(index) {
    const svg = createMarkSvg(board[index]);
    boardCells[index].append(svg);
  }

  return {
    board,
    addMove,
    checkIfMovePossible,
    clearBoard
  };
})();

// GAME PROCESS MODULE
const gameProcess = (function () {
  const nextRoundBlock = document.querySelector('.game-next-round-block');
  const nextRoundBlockTitle = document.querySelector('.game-next-round__title');
  const nextRoundButton = document.querySelector('.game-next-round-block__button');

  let gameMode;
  let isGameOver = false;

  function checkIfPlayerMove() {
    if (playerX.isAI && playerX.isMove) return false;
    if (playerO.isAI && playerO.isMove) return false;
    return true;
  }

  function checkIfTie() {
    for (let i = 0; i < AMOUNT_OF_CELLS; i++) {
      if (!gameBoard.board[i]) return false;
    }
    return true;
  }

  function checkIfWin() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
      [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < winningCombinations.length; i++) {
      const [i1, i2, i3] = winningCombinations[i];
      if (
        gameBoard.board[i1]
        && gameBoard.board[i1] === gameBoard.board[i2]
        && gameBoard.board[i1] === gameBoard.board[i3]
      ) {
        return true;
      }
    }
    return false;
  }


  function gamePVP() {

  }

  function gamePVE() {

  }

  function getGameState() {
    if (checkIfWin()) return (playerX.isMove) ? playerX : playerO;
    else if (checkIfTie()) return 'tie';
    else return 'continue';
  }

  function makePlayerMove(index) {
    if (!isGameOver) {
      if (gameBoard.checkIfMovePossible(index) && checkIfPlayerMove()) {
        gameBoard.addMove(index);
        watchGameProcess();
      }
    }
  }

  function showTie() {
    nextRoundBlockTitle.textContent = 'It is a tie!';
    nextRoundBlock.classList.remove('hidden');
  }

  function showWin(winner) {
    nextRoundBlockTitle.textContent = `${winner.name} has won!`;
    winner.wins++;
    statistics.refreshStatistics();
    nextRoundBlock.classList.remove('hidden');
  }

  function startGame(chosenGameMode) {
    gameMode = chosenGameMode;
    startNewRound();
  }

  function startNewRound() {
    isGameOver = false;
    [playerX.isMove, playerO.isMove] = [true, false];
    gameBoard.clearBoard();
    if (!nextRoundBlock.classList.contains('hidden')) {
      nextRoundBlock.classList.add('hidden');
    }

    if (gameMode === 'friend') gamePVP();
    if (gameMode === 'easy-ai') gamePVE();
    if (gameMode === 'hard-ai') gamePVE();
  }

  function toggleWhichTurn() {
    [playerX.isMove, playerO.isMove] = [playerO.isMove, playerX.isMove];
  }

  function watchGameProcess() {
    let gameState = getGameState();
    if (gameState === 'continue') {
      toggleWhichTurn();
    } else {
      isGameOver = true;
      if (gameState === 'tie') showTie();
      else showWin(gameState);
    }
  }

  boardCells.forEach((cell, index) => {
    cell.addEventListener('click', makePlayerMove.bind(null, index));
  });
  nextRoundButton.addEventListener('click', startNewRound);

  return { startGame };
})();

// STATISTICS MODULE
const statistics = (function () {
  const playerXName = document.querySelector('.statistics__player-name[data-player="X"]');
  const playerXWins = document.querySelector('.statistics__player-wins[data-player="X"]');
  const playerOName = document.querySelector('.statistics__player-name[data-player="O"]');
  const playerOWins = document.querySelector('.statistics__player-wins[data-player="O"]');

  function refreshStatistics() {
    playerXName.textContent = playerX.name;
    playerXWins.textContent = playerX.wins;
    playerOName.textContent = playerO.name;
    playerOWins.textContent = playerO.wins;
  }

  return { refreshStatistics };
})();

/* // GLOBAL VARIABLES
const boardCells = Array.from(document.querySelectorAll('.game-board__cell'));
let playerX, playerO;
const AMOUNT_OF_CELLS = boardCells.length;

// FORM MODULE
(function () {
  const startGameButton = document.querySelector('.header__start-game-button');
  const gameParametersFormWrapper = document.querySelector('.game-parameters-form-wrapper');
  const gameParametersForm = document.querySelector('.game-parameters-form');
  const gameModeFriendRadio = document.querySelector('[data-game-mode="friend"]');
  const gameModeEasyAIRadio = document.querySelector('[data-game-mode="easy-ai"]');
  const gameModeHardAIRadio = document.querySelector('[data-game-mode="hard-ai"]');
  const playerXNameInput = document.querySelector('.game-parameters-form__name-input[name="playerX-name"]');
  const playerONameInput = document.querySelector('.game-parameters-form__name-input[name="playerO-name"]');
  const playerMarkChoiceForm = document.querySelector('.game-parameters-form__player-mark-fieldset');
  const playerMarkXRadio = document.querySelector('[data-player-mark="X"]');
  const playerMarkORadio = document.querySelector('[data-player-mark="O"]');
  const submitGameParametersButton = document.querySelector('.game-parameters-form__submit-form');

  let chosenGameMode;

  resetForm();
  startGameButton.addEventListener('click', () => {
    resetForm();
    gameParametersFormWrapper.classList.remove('hidden');
  });

  gameModeFriendRadio.addEventListener('click', () => {
    chooseGameMode(gameModeFriendRadio);
  });
  gameModeEasyAIRadio.addEventListener('click', () => {
    chooseGameMode(gameModeEasyAIRadio);
  });
  gameModeHardAIRadio.addEventListener('click', () => {
    chooseGameMode(gameModeHardAIRadio);
  });
  playerMarkXRadio.addEventListener('click', () => {
    gameModeEasyAIRadio.checked
      ? chooseGameMode(gameModeEasyAIRadio)
      : chooseGameMode(gameModeHardAIRadio);
  });
  playerMarkORadio.addEventListener('click', () => {
    gameModeEasyAIRadio.checked
      ? chooseGameMode(gameModeEasyAIRadio)
      : chooseGameMode(gameModeHardAIRadio);
  });

  submitGameParametersButton.addEventListener('click', (e) => {
    e.preventDefault();
    createPlayers();
    gameProcess.startGame(chosenGameMode);
    gameParametersFormWrapper.classList.add('hidden');
  });

  function chooseAiPlayer(radioButton) {
    clearChosenForAiInputs();
    if (playerMarkXRadio.checked) {
      playerONameInput.setAttribute('readonly', '');
      radioButton === gameModeEasyAIRadio
        ? playerONameInput.value = 'Easy AI'
        : playerONameInput.value = 'Hard AI';
    }
    if (playerMarkORadio.checked) {
      playerXNameInput.setAttribute('readonly', '');
      radioButton === gameModeEasyAIRadio
        ? playerXNameInput.value = 'Easy AI'
        : playerXNameInput.value = 'Hard AI';
    }
  }

  function chooseGameMode(radioButton) {
    radioButton.checked = true;
    if (radioButton === gameModeFriendRadio) {
      chosenGameMode = 'friend';
      clearChosenForAiInputs();
      playerMarkChoiceForm.classList.add('hidden');
    } else {
      chooseAiPlayer(radioButton);
      playerMarkChoiceForm.classList.remove('hidden');
      radioButton === gameModeEasyAIRadio
        ? chosenGameMode = 'easy-ai'
        : chosenGameMode = 'hard-ai';
    }
  }

  function clearChosenForAiInputs() {
    if (playerXNameInput.hasAttribute('readonly')) {
      playerXNameInput.removeAttribute('readonly');
      playerXNameInput.value = '';
    }
    if (playerONameInput.hasAttribute('readonly')) {
      playerONameInput.removeAttribute('readonly');
      playerONameInput.value = '';
    }
  }

  function createPlayer(name, playerNumber, isAI = false) {
    return {
      name: name || `Player ${playerNumber}`,
      score: 0,
      isAI
    }
  }

  function createPlayers() {
    if (playerXNameInput.hasAttribute('readonly')) {
      playerX = createPlayer(playerXNameInput.value, '1', true);
      playerO = createPlayer(playerONameInput.value, '2');
    } else if (playerONameInput.hasAttribute('readonly')) {
      playerX = createPlayer(playerXNameInput.value, '1');
      playerO = createPlayer(playerONameInput.value, '2', true);
    } else {
      playerX = createPlayer(playerXNameInput.value, '1');
      playerO = createPlayer(playerONameInput.value, '2');
    }
  }

  function resetForm() {
    gameParametersForm.reset();
    chooseGameMode(gameModeFriendRadio);
    clearChosenForAiInputs();
  }

})();

// GAME BOARD MODULE
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
    return board.map(cell => cell);
  }

  function renderMark(index) {
    const svg = createMarkSvg(board[index]);
    boardCells[index].append(svg);
  }

  function renderMove(index, turn) {
    board[index] = (turn % 2 === 0) ? 'X' : 'O';
    renderMark(index);
  }

  function showWinner(index1, index2, index3) {
    boardCells[index1].firstChild.style.scale = '1.5';
    boardCells[index2].firstChild.style.scale = '1.5';
    boardCells[index3].firstChild.style.scale = '1.5';
  }

  return {
    clearBoard,
    getBoard,
    renderMove,
    showWinner
  }
})();

// GAME PROCESS MODULE
const gameProcess = (function () {
  const nextRoundBlock = document.querySelector('.game-next-round-block');
  const nextRoundBlockTitle = document.querySelector('.game-next-round__title');
  const nextRoundButton = document.querySelector('.game-next-round-block__button');

  let turn = 0;
  const roundWinner = [];
  let gameMode;
  let isMoveCoolDown = false;

  nextRoundButton.addEventListener('click', startNewRound);

  function checkTie(board) {
    for (let i = 0; i < AMOUNT_OF_CELLS; i++) {
      if (!board[i]) return false;
    }
    return true;
  }

  function checkWinner(board) {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < winningCombinations.length; i++) {
      const [i1, i2, i3] = winningCombinations[i];
      if (board[i1] && board[i1] === board[i2] && board[i1] === board[i3]) {
        saveWinner(board[i1], i1, i2, i3);
        return true;
      }
    }
    return false;
  }

  function chooseCellForAiMove() {
    const board = gameBoard.getBoard();
    if (gameMode === 'easy-ai') return chooseCellForEasyAi(board);
    if (gameMode === 'hard-ai') return chooseCellForHardAi(board);
  }

  function chooseCellForEasyAi(board) {
    let index;
    do {
      index = Math.floor(Math.random() * AMOUNT_OF_CELLS);
    } while (board[index]);
    return index;
  }

  function chooseCellForHardAi(board) {
    function minimax(board, newTurn, isMaximizing) {
      if (checkTie(board)) return 0;
      if (checkWinner(board)) return roundWinner[0].isAI ? 1 : -1;
      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < AMOUNT_OF_CELLS; i++) {
          if (!board[i]) {
            board[i] = (newTurn % 2 === 0) ? 'X' : 'O';
            let score = minimax(board, newTurn + 1, false);
            board[i] = undefined;
            bestScore = Math.max(bestScore, score);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < AMOUNT_OF_CELLS; i++) {
          if (!board[i]) {
            board[i] = (newTurn % 2 === 0) ? 'X' : 'O';
            let score = minimax(board, newTurn + 1, true);
            board[i] = undefined;
            bestScore = Math.min(bestScore, score);
          }
        }
        return bestScore;
      }
    }

    let bestScore = -Infinity;
    let bestCell;
    for (let i = 0; i < AMOUNT_OF_CELLS; i++) {
      if (!board[i]) {
        board[i] = (turn % 2 === 0) ? 'X' : 'O';
        let score = minimax(board, turn + 1, false);
        board[i] = undefined;
        if (score > bestScore) {
          bestScore = score;
          bestCell = i;
        }
      }
    }
    return bestCell;
  }

  function finishGame() {
    boardCells.forEach((cell) => {
      cell.removeEventListener('click', makePlayerMove);
    });
    boardCells.forEach((cell) => {
      cell.removeEventListener('click', playAiRoundTurn);
    });
  }

  function gamePVE() {
    if (playerX.isAI) setTimeout(makeAiMove, 250);
    boardCells.forEach((cell) => {
      cell.addEventListener('click', playAiRoundTurn);
    });
  }

  function gamePVP() {
    boardCells.forEach((cell) => {
      cell.addEventListener('click', makePlayerMove);
    });
  }

  function makeAiMove() {
    isMoveCoolDown = true;

    const indexToPlaceMark = chooseCellForAiMove();
    gameBoard.renderMove(indexToPlaceMark, turn);
    watchRoundProgress();
    turn++;

    setTimeout(() => isMoveCoolDown = false, 500);
  }

  function makePlayerMove(event) {
    if (isMoveCoolDown) return;

    let cellIndex = boardCells.indexOf(event.target);
    if (cellIndex !== -1 && event.target.innerHTML === '') {
      gameBoard.renderMove(cellIndex, turn);
      watchRoundProgress();
      turn++;

      isMoveCoolDown = true;
      setTimeout(() => isMoveCoolDown = false, 500);
    }
  }

  function playAiRoundTurn(event) {
    makePlayerMove(event);
    if (nextRoundBlock.classList.contains('hidden')) setTimeout(makeAiMove, 500);
  }

  function saveWinner(winnerMark, index1, index2, index3) {
    roundWinner[0] = (winnerMark === 'X') ? playerX : playerO;
    [roundWinner[1], roundWinner[2], roundWinner[3]] = [index1, index2, index3];
  }

  function showTie() {
    nextRoundBlockTitle.textContent = 'It is a tie!';
    setTimeout(() => nextRoundBlock.classList.remove('hidden'), 500);
  }

  function showWin() {
    setTimeout(gameBoard.showWinner, 0, roundWinner[1], roundWinner[2], roundWinner[3]);
    statistics.refreshStatistics();
    nextRoundBlockTitle.textContent = `${roundWinner[0].name} wins!`;
    setTimeout(() => nextRoundBlock.classList.remove('hidden'), 500);
  }

  function startGame(newGameMode) {
    gameMode = newGameMode;

    if (gameMode === 'friend') {
      boardCells.forEach((cell) => {
        cell.removeEventListener('click', playAiRoundTurn);
      });
    }

    statistics.refreshStatistics();
    startNewRound();
  }

  function startNewRound() {
    gameBoard.clearBoard();
    turn = 0;
    if (!nextRoundBlock.classList.contains('hidden')) {
      nextRoundBlock.classList.add('hidden');
    }

    if (gameMode === 'friend') gamePVP();
    if (gameMode === 'easy-ai') gamePVE();
    if (gameMode === 'hard-ai') gamePVE();
  }

  function watchRoundProgress() {
    const board = gameBoard.getBoard();
    if (checkWinner(board)) {
      roundWinner[0].score++;
      showWin();
      finishGame();
    } else if (checkTie(board)) {
      showTie();
      finishGame();
    }
  }

  return {
    startGame
  }

})();

// STATISTICS MODULE
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
})(); */