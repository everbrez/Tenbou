class Tenpou {
  constructor() {
    this.state = {
      players: [],
      dashboard: {},
      startPos: Math.floor(Math.random() * 4 + 1),
      master: {}
    }

    // afterroundend事件不会立即更新界面，会在下一轮开始才进行更新。
    // 该事件是用来做下一轮的准备工作

    // roundend事件发生在beforerounded事件之后，一般要结束游戏的检查放在roundend事件，计算分数的操作放在beforeroundend事件。
    // 尽量不要在roundend里进行数值操作，即改变state的一些内容，防止其他检查操作发生错误。
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

    this.state = Object.assign({}, oldState, newState || {});
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
    this.state.dashboard.onDraw(this.handleDraw.bind(this));
    this.state.dashboard.onMultiRon(this.handleMultiRon.bind(this));
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

  async handleDraw() {
    const dialog = new Dialog();
    const drawData = await dialog.showDrawDialog();
    if (!drawData) {
      return
    }

    this.handleRoundEnd('draw', this.state.players[0], drawData);
  }

  async handleMultiRon() {
    const dialog = new Dialog();
    const data = await dialog.showMultiRonDialog(this.state.players);
    if (!data) {
      return
    }

    this.handleRoundEnd('multiRon', this.state.players[0], data);
  }

  async roundEnd(type, player) {
    const dialog = new Dialog();
    const data = await dialog.showRoundEndDialog(type === 'tsumo');
    if (!data) {
      return
    }
    this.handleRoundEnd(type, player, data);
  }

  handleRoundEnd(type, player, ...args) {
    this.recordResult();
    try {
      this.emitEvent('beforeroundend', player, type, ...args);
      this.emitEvent('roundend', player, type, ...args);
      this.showResult();
      this.showNextRoundButton();
    } catch (error) {
      this.handleGameOver('主动结束游戏: ' + error.message)
    }
    this.setState();

    try {
      this.emitEvent('afterroundend');
    } catch (error) {
      this.handleGameOver('被动结束游戏: ' + error.message)
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
    this.state.dashboard.showResult();
  }

  hideResult() {
    this.state.players.forEach(player => {
      player.hideResult();
    })
    this.state.dashboard.hideResult();
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
