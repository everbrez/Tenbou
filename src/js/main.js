window.addEventListener('load', main, false);

function main() {
<<<<<<< HEAD
  window.a = new Tenbou();

  a.on('richi', (state, config, player) => {
=======
  const game = new Tenbou();
  game.on('richi', (state, config, player) => {
>>>>>>> 52103c9a42615f8e765ca1fee8f5995bfb6e3580
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

  game.on('beforeroundend', (state, config, player, Tenbou, type, data) => {
    // data 为用户在选择tsumo、ron、流局或者多人和输入的数据
    // type 为 tsumo ron 流局（draw）或者多人和（multiRon）
    const id = player.id;
    lastPlayer = state.players[(id - 1 - 1 + 4) % 4];
    player.score += 10000;
    lastPlayer.score -= 5000;
    return state;
  });

  game.on('roundend', (state, config, player, Tenbou, type) => {
    if (player.score > 42000) {
      Tenbou.gameover('点数超过42000');
    }
  });

  game.on('afterroundend', (state, _config, _player, Tenbou) => {
    state.dashboard.honba += 1;
    if (state.dashboard.roundName === '南四局') {
      Tenbou.gameover('正常流局');
    }
  });

  game.start();
}
