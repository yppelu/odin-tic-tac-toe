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

  startGameButton.addEventListener('click', () => {
    gameParametersFormWrapper.classList.remove('hidden');
  });
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

    statistics.refreshStatistics();
    gameParametersFormWrapper.classList.add('hidden');
    playerONameInput.removeAttribute('readonly');
    gameParametersForm.reset();
  });

  function chooseGameMode(radioButton) {
    radioButton.checked = true;
    if (radioButton === gameModeFriendRadio) {
      playerONameInput.removeAttribute('readonly');
      playerONameInput.value = '';
    } else {
      playerONameInput.setAttribute('readonly', '');
      playerONameInput.value = radioButton === gameModeEasyAiRadio
        ? 'Easy AI'
        : 'Hard AI';
    }
  }

  function createPlayer(name, playerNumber) {
    return {
      name: name || `Player ${playerNumber}`,
      score: 0
    }
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