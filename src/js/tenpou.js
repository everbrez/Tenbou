class Tenpou {
  constructor() {
    this.state = {
      players: [],
      dashboard: {},
      startPos: Math.floor(Math.random() * 4 + 1),
      master: {}
    }

    this.eventHandler = {
      'gamestart': [],
      'roundend': [],
      'beforeroundend': [],
      'afterroundend': [],
      'ron': [],
      'richi': [],
      'beforerichi': [],
      'tsumo': []
    }

    this.config = {}
  }

  async init() {
    // 此处get用户的设置，初始化player
    let dialog = new Dialog();
    const players = await dialog.showUserConfigDialog();

    this.state.players = players;
    this.state.master = players[0];

    const roundNames = [
      '東一局', '東二局', '東三局', '東四局',
      '南一局', '南二局', '南三局', '南四局'
    ];

    this.state.dashboard = new DashBoard({
      richi: 0,
      honba: 0,
      round: 1,
      roundNames,
    });

    this.emitEvent('gamestart');
  }

  mount() {
    const container = document.querySelector('.container');
    const playerInstance = this.state.players.map(player => player.render());
    const dashboardInstance = this.state.dashboard.render();
    this.bindEvent()
    container.append(...playerInstance, dashboardInstance);
  }

  emitEvent(eventName, identify, ...args) {
    const oldState = this.state
    const newState = this.eventHandler[eventName].reduce((state,
      handler) => {
      return handler(state, this.config, identify, this, ...args)
    }, this.state)

    this.state = Object.assign({}, oldState, newState);
  }

  on(eventName, eventHandler) {
    this.eventHandler[eventName].push(eventHandler)
  }

  bindEvent() {
    this.state.players.forEach(el => {
      el.onRichi((player) => {
        console.log('richi')
        this.emitEvent('beforerichi', player);
        this.emitEvent('richi', player);
        this.setState();
      })

      el.onRon(player => {
        this.roundEnd('ron', player)
      })

      el.onTsumo(player => {
        this.roundEnd('tsumo', player)
      })
    });
    // bind next round button
    this.state.dashboard.onNextRound(this.nextRound.bind(this));
  }

  setState(cb = state => state) {
    if (cb) {
      const oldState = this.state;
      const newState = cb(this.state)
      this.state = Object.assign({}, oldState, newState);
    }

    this.render();
  }

  render() {
    this.state.players.forEach(player => player.update());
    this.state.dashboard.update();
  }

  async roundEnd(type, player) {
    const dialog = new Dialog();
    const data = await dialog.showRoundEndDialog();
    this.recordResult();
    try {
      this.emitEvent('beforeroundend', player, type, data);
      this.emitEvent('roundend', player, type, data);
      this.showResult();
      this.showNextRoundButton();
    } catch (error) {
      this.handleGameOver('主动结束游戏: ' + error.message)
    }

    try {
      this.emitEvent('afterroundend');
    } catch (error) {
      this.handleGameOver('被动结束游戏: ' + error.message)
    }

    this.setState();
  }

  showNextRoundButton() {
    this.state.dashboard.showNextRoundButton();
  }

  hideNextRoundButton() {
    this.state.dashboard.hideNextRoundButton();
  }

  showResult() {
    this.state.players.forEach(player => {
      player.showResult();
    })
  }

  hideResult() {
    this.state.players.forEach(player => {
      player.hideResult();
    })
  }

  recordResult() {
    this.state.players.forEach(player => {
      player.recordScore();
    })
  }

  nextRound() {
    // 骰子
    this.hideResult();
    this.hideNextRoundButton();
    // reset player richi status
    this.state.players.forEach(player => player.richi = false)
    this.state.dashboard.nextRound();
    this.setState();
  }

  gameover(message) {
    throw new Error(message)
  }

  handleGameOver(message) {
    alert(message)
  }

  async start() {
    await this.init();
    this.mount();
  }
}
