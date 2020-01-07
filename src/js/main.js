window.addEventListener('load', main, false);

function main() {
  const game = new Tenbou();

  // 立直
  game.on('richi', (state, event) => {
    /*if (getSetting()["击飞"]) {
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

    return state;*/
  });

  game.on('beforeRoundEnd', (state, event) => {
    /*
    // data 为用户在选择tsumo、ron、流局或者多人和输入的数据
    // type 为 tsumo ron 流局（draw）或者多人和（multiRon）
    const id = player.id;
    lastPlayer = state.players[(id - 1 - 1 + 4) % 4];
    player.score += 10000;
    lastPlayer.score -= 5000;
    return state;*/
  });

  game.on('roundend', (state, event) => {
    /*if (player.score > 42000) {
      Tenbou.gameover('点数超过42000');
    }*/
  });

  game.on('afterRoundEnd', (state, event) => {
    /*state.dashboard.honba += 1;
    if (state.dashboard.roundName === '南四局') {
      Tenbou.gameover('正常流局');
    }*/
  });

  game.start();
}
