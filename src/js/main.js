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
      target,
      data,
      data: { fan, fu },
      loser = target.findByRelation(data['loser'])
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

    if (target.oya)
      score *= 6;
    else
      score *= 4;

    score = Math.ceil(score / 100) * 100 + state.dashboard.honba * getSetting()['场棒点数'];

    target.roundData += score + state.dashboard.richi * getSetting()['立直棒点数'];
    loser.roundData += -score;

    return state;
  });

  game.on('tsumo', (state, event) => {
    const {
      target,
      data: { fan, fu }
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

    if (target.oya) {
      score = Math.ceil(2 * score / 100) * 100 + state.dashboard.honba * getSetting()['场棒点数'] / 3;

      const players = getPlayers();
      for (const player of players) {
        if (player !== target)
          player.roundData -= score;
        else
          player.roundData += score * 3 + state.dashboard.richi * getSetting()['立直棒点数'];
      }
    } else {
      const players = getPlayers();
      for (const player of players) {
        if (player !== target) {
          if (player.oya)
            player.roundData -= Math.ceil(2 * score / 100) * 100 + state.dashboard.honba * getSetting()['场棒点数'] / 3;
          else
            player.roundData -= Math.ceil(score / 100) * 100 + state.dashboard.honba * getSetting()['场棒点数'] / 3;
        } else {
          player.roundData += Math.ceil(2 * score / 100) * 100 + Math.ceil(score / 100) * 100 * 2 + state.dashboard.honba * getSetting()['场棒点数'] + state.dashboard.richi * getSetting()['立直棒点数'];
        }
      }
    }

    return state;
  });

  game.on('ryukyoku', (state, event) => {
    console.log('流局');
    console.log(event)

    return state;
  });

  game.on('beforeRoundEnd', (state, event) => {
    const {
      target
    } = event;

    target.showResult();

    return state;
  });

  game.on('roundEnd', (state, event) => {
    const {
      target
    } = event;

    target.showNextRoundButton();
    target.setState();

    return state;
  });

  game.on('afterRoundEnd', (state, event) => {
    /*const {
      target
    } = event;

    // 骰子
    //target.hideResult();
    //target.hideNextRoundButton();

    target.state.players.forEach(player => player.nextRound());
    target.state.dashboard.nextRound();
    target.setState();*/

    return state;
  });

  game.start();
}
