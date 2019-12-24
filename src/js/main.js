window.addEventListener('load', main, false);

function main() {
  window.a = new Tenpou()
  a.on('richi', (state, config, player) => {
    state.dashboard.richi += 1;
    player.score -= 1000;
    player.richi = true;
    return state
  })

  a.on('beforeroundend', (state, config, player, tenpou, type) => {
    const id = player.id
    lastPlayer = state.players[(id - 1 - 1 + 4) % 4];
    player.score += 500;
    lastPlayer.score -= 500;
    return state;
  })

  a.on('roundend', (state, config, player, tenpou, type) => {
    if(player.score > 42000) {
      tenpou.gameover('点数超过42000');
    }
  })

  a.on('afterroundend', (state, _config, _player, tenpou) => {
    state.dashboard.honba += 1;
    if (state.dashboard.roundName === '南四局') {
      tenpou.gameover('正常流局');
    }
  })

  a.start();
}
