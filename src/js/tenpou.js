class Tenpou {
  constructor() {
    this.state = {
      players: [],
      dashboard: new DashBoard({
        richi: 0,
        honba: 0,
        round: `东二局`,
      }),
      startPos: Math.floor(Math.random() * 4 + 1)
    }

    this.eventHandler = {
      'roundend': [],
      'beforeroundend': [],
      'ron': [],
      'richi': [],
      'beforerichi': [],
      'tsumo': []
    }

    this.config = {}
  }

  init() {
    // 此处get用户的设置，初始化player
    this.state.players = new Array(4).fill(0).map((_val, index) => {
      return new Player({
        id: index + 1,
        position: '东南西北' [(this.state.startPos - index - 1 + 4) % 4],
        score: 12000 + index + 1,
      })
    })
  }

  mount() {
    const container = document.querySelector('.container');
    const playerInstance = this.state.players.map(player => player.render());
    const dashboardInstance = this.state.dashboard.render();
    this.bindEvent()
    container.append(...playerInstance, dashboardInstance);
  }

  omitEvent(eventName, identify, ...args) {
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
        this.omitEvent('beforerichi', player);
        this.omitEvent('richi', player);
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

  roundEnd(type, player) {
    this.recordResult();
    try {
      this.omitEvent('beforeroundend', player, type);
      this.omitEvent('roundend', player, type);
      this.showResult();
      this.showNextRoundButton();
      this.setState();
    } catch (error) {
      alert('主动结束游戏: ' + error.message)
    }
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
    this.setState();
  }

  gameover(message) {
    throw new Error(message)
  }
}
