class DashBoard {
  constructor(options = {}) {
    const {
      richi = 0, honba = 0, round = '东二局'
    } = options;
    this.richi = richi;
    this.honba = honba;
    this.round = round

    this.container = null;
    this.isShowNextRoundButton = false;
  }

  render() {
    const {
      richi,
      honba,
      round
    } = this;
    const htmlTemplate = `
    <div class="status">
      <h2 class="round">${round}</h2>
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
      round
    } = this;

    const richiContainer = this.container.querySelector('.richi-number');
    const honbaContainer = this.container.querySelector('.honba-number');
    const roundContainer = this.container.querySelector('.round');
    const nextRoundButton = this.container.querySelector('.next-round');

    richiContainer.innerHTML = richi;
    honbaContainer.innerHTML = honba;
    roundContainer.innerHTML = round;

    if (this.isShowNextRoundButton) {
      nextRoundButton.classList.remove('hidden')
    } else {
      nextRoundButton.classList.add('hidden');
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
}
