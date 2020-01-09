window.addEventListener('load', main, false);

function main() {
  const game = new Tenbou();

  // 立直
  game.on('richi', (state, event) => {
    const {
      target: player,
      richiPoint = Setting.getSetting()['立直棒点数']
    } = event;

    if (Setting.getSetting()['击飞'] && player.score < richiPoint) {
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
      data,
      data: { fan, fu },
      loser = player.findByRelation(data['loser'])
    } = event;
    let score = 0;

    // fans = ['1翻', '2翻', '3翻', '4翻', '满贯（3/4-5翻）', '跳满（6-7翻）', '倍满（8-10翻）', '三倍满（11-12翻）', '役满/累计役满', '两倍役满', '三倍役满', '四倍役满', '五倍役满', '六倍役满'];
    switch (fan) {
      case 0: case 1: case 2: case 3:
        score = fu * 2 ** (fan + 1 + 2);
        if (score >= 2000)
          score = 2000;
        break;
      case 4:
        score = 2000;
        break;
      case 5:
        score = 2000 * 1.5;
        break;
      case 6:
        score = 2000 * 2;
        break;
      case 7:
        score = 2000 * 3;
        break;
      case 8:
        score = 2000 * 4;
        break;
      case 9:
        score = 2000 * 4 * 2;
        break;
      case 10:
        score = 2000 * 4 * 3;
        break;
      case 11:
        score = 2000 * 4 * 4;
        break;
      case 12:
        score = 2000 * 4 * 5;
        break;
      case 13:
        score = 2000 * 4 * 6;
        break;
      default:
    }

    if (player.oya)
      score *= 6;
    else
      score *= 4;

    score = Math.ceil(score / 100) * 100;

    score += state.dashboard.honba * getSetting()['场棒点数'];

    player.roundData += score + state.dashboard.richi * getSetting()['立直棒点数'];
    loser.roundData += -score;

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

  game.on('roundEnd', (state, event) => {
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
