window.addEventListener('load', main, false);

function main() {
  const game = new Tenbou();

  // 立直
  game.on('richi', (state, event) => {
    const {
      target: player,
      richiPoint = getSetting()['立直棒点数']
    } = event;

    if (getSetting()['击飞'] && player.score < richiPoint) {
      alert('点数不足以立直');
    } else {
      state.dashboard.richi += 1;
      player.score -= richiPoint;
      player.richi = true;
    }

    return state;
  });

  game.on('ron', (state, event) => {
    const {
      target: player,
      data: { fan, fu },
      loser = player.findByRelation(data['loser'])
    } = event;

    // fans = ['1翻', '2翻', '3翻', '4翻', '满贯（2/3/4-5翻）', '跳满（6-7翻）', '倍满（8-10翻）', '三倍满（11-12翻）', '役满/累计役满', '两倍役满', '三倍役满', '四倍役满', '五倍役满', '六倍役满'];
    switch (fan) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
        break;
      case 11:
        break;
      case 12:
        break;
      case 13:
        break;
    }

    return state;
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
