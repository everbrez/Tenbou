const defaultRoundNames = [
  '東一局', '東二局', '東三局', '東四局',
  '南一局', '南二局', '南三局', '南四局'
];

class DashBoard {
  constructor(options = {}) {
    const {
      richi = 0, honba = 0, round = 1, roundNames = defaultRoundNames
    } = options;
    this.richi = richi;
    this.honba = honba;
    this.round = round;
    this.roundNames = roundNames
    this.isShowResult = false;

    this.roundName = this.roundNames[round - 1];

    this.container = null;
    this.isShowNextRoundButton = false;
  }

  render() {
    const {
      richi,
      honba,
      roundName
    } = this;
    const htmlTemplate = `
    <div class="status">
      <h2 class="round">${roundName}</h2>
      <h2 class="honba">
        <li>
          <span class="honba-dot"></span>
          <span class="honba-dot"></span>
          <span class="honba-dot"></span>
          <span class="honba-dot"></span>
        </li>
        <li>
          <span class="honba-dot"></span>
          <span class="honba-dot"></span>
          <span class="honba-dot"></span>
          <span class="honba-dot"></span>
        </li>
        <span class="honba-info">
          ×
          <span class="honba-number">${honba}</span>
        </span>

      </h2>
      <h2 class="richi">
        立直
        <span class="richi-info">
          ×
          <span class="richi-number">${richi}</span>
        </span>
      </h2>
      <button class="draw-button">流局</button>
      <button class="multi-ron-button">多家和</button>
      <br />
      <button class="next-round hidden">Next Round</button>
    </div>`

    this.container = document.createElement('div');
    this.container.className = 'main';
    this.container.id = 'dashboard';
    this.container.innerHTML = htmlTemplate;

    return this.container;
  }

  update() {
    if (!this.container) {
      throw new Error('you should call render bebore update');
    }

    const {
      richi,
      honba,
      roundName
    } = this;

    const richiContainer = this.container.querySelector('.richi-number');
    const honbaContainer = this.container.querySelector('.honba-number');
    const roundContainer = this.container.querySelector('.round');
    const nextRoundButton = this.container.querySelector('.next-round');
    const drawButton = this.container.querySelector('.draw-button');
    const multiRonButton = this.container.querySelector('.multi-ron-button');

    richiContainer.innerHTML = richi;
    honbaContainer.innerHTML = honba;
    roundContainer.innerHTML = roundName;

    if (this.isShowNextRoundButton) {
      nextRoundButton.classList.remove('hidden')
    } else {
      nextRoundButton.classList.add('hidden');
    }

    if (this.isShowResult) {
      drawButton.disabled = true
      multiRonButton.disabled = true
    } else {
      drawButton.disabled = false
      multiRonButton.disabled = false
    }
  }

  showNextRoundButton() {
    this.isShowNextRoundButton = true;
  }

  hideNextRoundButton() {
    this.isShowNextRoundButton = false;
  }

  onNextRound(cb) {
    if (!cb) {
      throw new Error('you should provide an callback');
    }
    const nextRoundButton = this.container.querySelector('.next-round');
    nextRoundButton.addEventListener('click', cb, false);
  }

  nextRound() {
    this.round += 1;
    this.roundName = this.roundNames[this.round - 1];
  }

  onDraw(cb) {
    if (!cb) {
      throw new Error('you should provide an callback');
    }

    const drawButton = this.container.querySelector('.draw-button')
    drawButton.addEventListener('click', cb, false)
  }

  onMultiRon(cb) {
    if (!cb) {
      throw new Error('you should provide an callback');
    }
    const multiRonButton = this.container.querySelector('.multi-ron-button')
    multiRonButton.addEventListener('click', cb, false)
  }

  showResult() {
    this.isShowResult = true
  }

  hideResult() {
    this.isShowResult = false;
  }
}
