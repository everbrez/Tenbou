window.addEventListener('load', () => {
  class Tenpou {
    constructor() {
      this.state = {
        score: {
          player1: 12000,
          player2: 12002,
          player3: 12003,
          player4: 12004,
        },
        startPos: Math.floor(Math.random() * 4 + 1),
        // 立直
        richi: 0,
        // 本场
        honba: 0,
        round: `东二局`,
        // 立直具体
        richiState: {
          player1: false,
          player2: false,
          player3: false,
          player4: false,
        }
      }

      this.eventHandler = {
        'roundstart': [],
        'roundend': [],
        'beforeroundend': [],
        'ron': [],
        'richi': [],
        'beforerichi': [],
        'tsuma': []
      }

      this.instance = {}

      this.config = {}

    }

    getDomInstance(query) {
      const dom = document.querySelector(query);
      if (!dom) {
        return
      }

      return dom
    }

    saveDomInstance() {
      this.instance.round = this.getDomInstance('#dashboard .round');
      this.instance.honba = this.getDomInstance('#dashboard .honba');
      this.instance.richi = this.getDomInstance('#dashboard .richi');

      ['player1', 'player2', 'player3', 'player4'].forEach((player) => {
        this.instance[player] = {
          score: this.getDomInstance(`#${player} .player-score`),
          playerName: this.getDomInstance(
            `#${player} .player-name`),
          position: this.getDomInstance(`#${player} .position`),
          actions: {
            ron: this.getDomInstance(`#${player} .actions .ron`),
            richi: this.getDomInstance(
              `#${player} .actions .richi`),
            tsumo: this.getDomInstance(
              `#${player} .actions .tsumo`),
          }
        }
      })
    }

    on(eventName, handler) {
      this.eventHandler[eventName].push(handler)
    }

    omitEvent(eventName, identify) {
      const oldState = this.state
      const newState = this.eventHandler[eventName].reduce((state,
        handler) => {
        return handler(state, this.config, identify)
      }, this.state)

      this.setState(Object.assign({}, oldState, newState))
    }

    bindEvents() {
      ['player1', 'player2', 'player3', 'player4'].forEach((player) => {
        const {
          ron,
          richi,
          tsumo
        } = this.instance[player].actions;
        ron.addEventListener('click', () => {
          this.omitEvent('ron', player)
        }, false)
        richi.addEventListener('click', () => {
          this.omitEvent('richi', player)
        }, false)
        tsumo.addEventListener('click', () => {
          this.omitEvent('tsumo', player)
        }, false)
      })
    }

    setState(state) {
      this.state = state;
      this.render();
    }

    render() {
      const {
        score,
        startPos,
        richi,
        honba,
        round,
        richiState
      } = this.state;

      this.instance.round.innerHTML = round;
      this.instance.honba.innerHTML = `${honba}本场`;
      this.instance.richi.innerHTML = `${richi}立直`;

      ['player1', 'player2', 'player3', 'player4'].forEach((player,
        index) => {
        this.instance[player].score.innerHTML = score[player];
        if (richiState[player]) {
          this.instance[player].actions.richi.classList.add('active');
          this.instance[player].actions;
        } else {
          this.instance[player].actions.richi.classList.remove(
            'active');
        }

        this.instance[player].position.innerHTML = '东南西北' [(startPos -
          index - 1 + 4) % 4];
      })
    }

    init() {
      this.saveDomInstance();
      this.bindEvents();
      this.render();
    }

    start() {
      this.init();
      this.loop();
    }

    loop() {
      // loop
      console.log('loop')
    }
  }

  window.a = new Tenpou()
  a.on('richi', (state, config, player) => {
    const {
      score
    } = state;

    score[player] -= 1000;
    return {
      score,
      richi: state.richi + 1
    }
  })
  a.start();
}, false)
