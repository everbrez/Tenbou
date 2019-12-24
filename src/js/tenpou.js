class Tenpou {
  constructor() {
    this.state = {
      players: [],
      startPos: Math.floor(Math.random() * 4 + 1),
      // 立直
      richi: 0,
      // 本场
      honba: 0,
      round: `东二局`,
    }

    this.eventHandler = {
      'roundstart': [],
      'roundend': [],
      'beforeroundend': [],
      'ron': [],
      'richi': [],
      'beforerichi': [],
      'tsumo': []
    }

    this.instance = {}

    this.config = {}

  }

  init() {
    // 此处get用户的设置，初始化player
    this.state.players = new Array(4).fill(0).map((_val, index) =>
      new Player({
        id: index + 1,
        position: '东南西北' [(this.startPos - index - 1 + 4) % 4],
        score: 12000 + index + 1,
      }))
  }

  mount() {
    const container = document.querySelector('.container');
    const instance = this.state.players.map(player => player.render())
    this.bindEvent()
    container.append(...instance);
  }

  omitEvent(eventName, identify) {
    const oldState = this.state
    const newState = this.eventHandler[eventName].reduce((state,
      handler) => {
      return handler(state, this.config, identify)
    }, this.state)

    this.setState(Object.assign({}, oldState, newState))
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
      })

      el.onRon(player => {
        this.omitEvent('ron', player)
      })

      el.onTsumo(player => {
        this.omitEvent('tsumo', player)
      })
    })
  }

  setState(state) {
    this.state = state;
    this.render();
  }

  render() {
    this.state.players.forEach(player => player.update())
  }

  loop() {
    // loop
    console.log('loop')
  }
}
