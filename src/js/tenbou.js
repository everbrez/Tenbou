class Tenbou {
  constructor() {
    this.state = {
      // 玩家，一般为4个player对象
      players: [],
      // 页面中间的状态显示器
      dashboard: {},
      // 开始位置，一般： startPos = 1: player1是东，其他按照player2西，3南，4北的顺序。
      startPos: Math.floor(Math.random() * 4 + 1),
      master: {}
    }

    // afterroundend事件不会立即更新界面，会在下一轮开始才进行更新。
    // 该事件是用来做下一轮的准备工作

    // roundend事件发生在beforerounded事件之后，一般要结束游戏的检查放在roundend事件，计算分数的操作放在beforeroundend事件。
    // 尽量不要在roundend里进行数值操作，即改变state的一些内容，防止其他检查操作发生错误。

    // init 事件是将 player 和 dashboard 对象实例化之后，还没有进行render()，即还没有插入页面的时候触发事件。主要用来处理一些默认参数，如根据配置来设置初始化点数、游戏模式等等。
    this.eventHandler = {
      'init': [],
      'roundend': [],
      'beforeroundend': [],
      'afterroundend': [],
      'richi': [],
      'beforerichi': [],
      'ron': [],
      'tsumo': []
    };

    this.config = {};

    this.onEndHandler = [];
  }

  async init() {
    // 此处get用户的设置，初始化player
    let dialog = new Dialog();

    await dialog.showConfigDialog();
    this.config = getSetting();

    // 读取用户设置的 palyer 信息，包括名字，startPos等
    const playersConfig = await dialog.showUserConfigDialog();
    initPlayers(playersConfig);

    this.state.players = players;
    // 初始化庄家
    this.state.master = players[0];

    this.state.dashboard = new DashBoard({
      richi: 0,
      honba: 0,
      // round 与 roundName 对应，表示现在是第几局
      round: 0,
    });

    this.emitEvent('init');
  }

  onEnd(cb) {
    this.onEndHandler.push(cb);
  }

  // mount 是将player和dashboard插入页面的函数，生成dom并插入的过程
  mount() {
    const container = document.querySelector('.container');
    const playerInstance = this.state.players.map(player => player.render());
    const dashboardInstance = this.state.dashboard.render();
    this.bindEvent();
    container.append(...playerInstance, dashboardInstance);
  }

  // 事件触发统一分发器，identity一般为player对象，其他参数会根据不同情况传入回调函数
  emitEvent(eventName, identify, ...args) {
    const oldState = this.state;
    const newState = this.eventHandler[eventName].reduce((state,
      handler) => {
      return handler(state, this.config, identify, this, ...args)
    }, this.state);

    this.state = Object.assign({}, oldState, newState || {});
  }

  // 对外接口，用来注册事件
  on(eventName, eventHandler) {
    this.eventHandler[eventName].push(eventHandler);
  }

  // tenbou 本身对 dom 事件的绑定，一般在mount阶段触发
  bindEvent() {
    this.state.players.forEach(el => {
      el.onRichi((player) => {
        console.log('richi');
        this.emitEvent('beforerichi', player);
        this.emitEvent('richi', player);
        this.setState();
      });

      el.onRon(player => {
        this.roundEnd('ron', player);
      });

      el.onTsumo(player => {
        this.roundEnd('tsumo', player);
      });
    });
    // bind next round button
    this.state.dashboard.onNextRound(this.nextRound.bind(this));
    this.state.dashboard.onRyukyoku(this.handleRyukyoku.bind(this));
    this.state.dashboard.onMultiRon(this.handleMultiRon.bind(this));
  }

  // 这个可以触发界面更新，如果输入的是函数，则可以用在异步更新中
  // 如果没有参数，则根据当前state的信息更新界面
  setState(cb = state => state) {
    if (cb) {
      const oldState = this.state;
      const newState = cb(this.state);
      this.state = Object.assign({}, oldState, newState);
    }

    this.render();
  }

  // 更新界面的直接函数，被setState调用
  render() {
    this.state.players.forEach(player => player.update());
    this.state.dashboard.update();
  }

  // 处理流局
  // TODO: 检测是否有设置流局
  async handleRyukyoku() {
    const dialog = new Dialog();
    const drawData = await dialog.showRyukyokuDialog();
    if (!drawData) {
      return;
    }

    this.handleRoundEnd('draw', this.state.players[0], drawData);
  }

  // 处理多人和
  async handleMultiRon() {
    const dialog = new Dialog();
    const data = await dialog.showMultiRonDialog(this.state.players);
    if (!data) {
      return;
    }

    this.handleRoundEnd('multiRon', this.state.players[0], data);
  }

  // 一局正常结束： 某个player 和或者自摸
  async roundEnd(type, player) {
    const dialog = new Dialog();
    const data = type === 'tsumo'
      ? await dialog.showTsumoDialog()
      : await dialog.showRonDialog();
    if (!data) {
      return;
    }
    this.handleRoundEnd(type, player, data);
  }

  // 一局结束的统一入口，通过是否抛出错误判断是否主动结束游戏（如满足某些条件）
  handleRoundEnd(type, player, ...args) {
    this.recordResult();
    try {
      this.emitEvent('beforeroundend', player, type, ...args);
      this.emitEvent('roundend', player, type, ...args);
      this.showResult();
      this.showNextRoundButton();
    } catch (error) {
      this.handleGameOver('主动结束游戏: ' + error.message);
    }
    this.setState();

    try {
      this.emitEvent('afterroundend');
    } catch (error) {
      this.handleGameOver('被动结束游戏: ' + error.message);
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
    });
    this.state.dashboard.showResult();
  }

  hideResult() {
    this.state.players.forEach(player => {
      player.hideResult();
    });
    this.state.dashboard.hideResult();
  }

  recordResult() {
    this.state.players.forEach(player => {
      player.recordScore();
    });
  }

  // 下一局前做的更新、前处理操作
  nextRound() {
    // 骰子
    this.hideResult();
    this.hideNextRoundButton();
    // reset player richi status
    this.state.players.forEach(player => player.richi = false)
    this.state.dashboard.nextRound();
    this.setState();
  }

  // 对外接口，用来主动结束游戏
  gameover(message) {
    throw new Error(message);
  }

  // 用来显示结算界面用
  async handleGameOver(message) {
    const dialog = new Dialog();
    const isContinue = await dialog.showResultDialog(this.state.players)
    if (isContinue) {
      this.continue();
      return
    }

    this.handleEnd();
  }

  continue() {
    // 重置
    this.state.players.forEach(player => player.reset())
    this.state.dashboard.reset();
    this.emitEvent('init');
    this.setState();
  }

  handleEnd() {
    this.state.players.forEach(player => player.unmout())
    this.state.dashboard.unmout();
    this.onEndHandler.forEach(cb => cb());
  }

  // 对外接口，一场游戏的开始
  async start() {
    await this.init();
    this.mount();
  }
}
