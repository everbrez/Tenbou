window.addEventListener('load', main, false);

function main() {
  window.a = new Tenbou();

  a.on('richi', (state, config, player) => {
    console.log(state);
    console.log(config);
    console.log(player);

    if (config["击飞"].select) {
      if (player.score >= 1000) {
        state.dashboard.richi += 1;
        player.score -= 1000;
        player.richi = true;
      }
    } else {
      state.dashboard.richi += 1;
      player.score -= 1000;
      player.richi = true;
    }

    return state;
  });

  a.on('beforeroundend', (state, config, player, Tenbou, type) => {
    const id = player.id;
    lastPlayer = state.players[(id - 1 - 1 + 4) % 4];
    player.score += 10000;
    lastPlayer.score -= 5000;
    return state;
  });

  a.on('roundend', (state, config, player, Tenbou, type) => {
    if (player.score > 42000) {
      Tenbou.gameover('点数超过42000');
    }
  });

  a.on('afterroundend', (state, _config, _player, Tenbou) => {
    state.dashboard.honba += 1;
    if (state.dashboard.roundName === '南四局') {
      Tenbou.gameover('正常流局');
    }
  });

  a.start();
}
