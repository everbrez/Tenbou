const characterList = {
  '清澄高中': ['片冈优希', '染谷真子', '竹井久', '原村和', '宫永咲'],
  '龙门渕高中': ['井上纯', '泽村智纪', '国广一', '龙门渕透华', '天江衣'],
  '鹤贺学园': ['津山睦月', '妹尾佳织', '蒲原智美', '东横桃子', '加治木由美'],
  '风越女子': ['福路美穗子', '吉留未春', '文堂星夏', '深堀纯代', '池田华菜'],
  '阿知贺女子': ['松实玄', '松实宥', '新子憧', '鹭森灼', '高鸭稳乃'],
  '晚成高中': ['小走八重', '丸濑纪子', '木村日菜', '上田良子', '巽由华'],
  '白糸台高中': ['宫永照', '弘世堇', '涩谷尧深', '亦野诚子', '大星淡'],
  '临海女子': ['辻垣内智叶', '郝慧宇', '雀明华', '梅根·戴文', '耐莉'],
  '千里山女子': ['园城寺怜', '二条泉', '江口夕', '船久保浩子', '清水谷龙华'],
  '姬松高中': ['上重漫', '真濑由子', '爱宕洋榎', '爱宕绢惠', '末原恭子'],
  '新道寺女子': ['花田煌', '安河内美子', '江崎仁美', '白水哩', '鹤田姬子'],
  '有珠山高中': ['本内成香', '桧森誓子', '岩馆摇杏', '真屋由晖子', '狮子原爽'],
  '永水女子': ['神代小莳', '狩宿巴', '泷见春', '薄墨初美', '石户霞'],
  '宫守女子': ['小濑川白望', '爱丝琳', '鹿仓胡桃', '臼泽塞', '姊带丰音'],
  '越谷女子': ['新井索菲亚', '浅见花子', '水村史织', '宇津木玉子', '八木原景子'],
  '剑谷高中': ['椿野美幸', '依藤澄子', '古冢梢', '森垣友香', '安福莉子'],
}

window.characterList = characterList;

function getRandomName() {
  const schoolList = Object.keys(characterList);
  const school = schoolList[Math.floor(Math.random() * schoolList.length)];
  const nameList = characterList[school];
  const name = nameList[Math.floor(Math.random() * nameList.length)];

  return name
}

window.getRandomNames = function() {
  let set = new Set();
  while(set.size < 4) {
    const name = getRandomName();
    set.add(name)
  }
  return [...set]
}

function getRandomAvatar() {
  const index = Math.floor(Math.random() * 35);
  return '64978502_p' + index
}

class Player {
  constructor(options = {}) {
    const {
      position,
      name = getRandomName(),
      avatar = getRandomAvatar(),
      id,
      score = position === '东' ? 16000 : 12000,
      richi = false
    } = options;

    this.position = position; // 东西南北
    this.name = name;
    this.avatar = avatar; // 64978502_p5
    this.id = id; // id: number
    this.score = score;
    this.result = '+ 0';
    this.isShowResult = false;

    this.richi = richi; // default false
    this.container = null
    this.identity = 'player' + id;
  }

  recordScore() {
    this.record = this.score;
  }

  showResult() {
    this.isShowResult = true
    const result = this.score - this.record;
    if (result >= 0) {
      this.result = '+ ' + result;
      return
    }

    this.result = '- ' + -result;
  }

  hideResult() {
    this.isShowResult = false;
  }

  render() {
    const htmlTemplate = `
      <div class="player-position">
        <span class="position">${this.position}</span>
      </div>

      <div class="player-main">
        <button class="richi ${this.richi ? 'active' : ''}">立直</button>
        <span class="player-score">
          ${this.score}
        </span>
        <div class="player-info">
          <img src="./img/player/${this.avatar}.png" alt="${this.identity}">
          <span class="player-name">${this.name}<span>
        </div>
      </div>

      <div class="actions">
        <button class="ron">ロン</button>
        <button class="tsumo">ツモ</button>
      </div>
    `;
    const container = document.createElement('div');
    container.innerHTML = htmlTemplate;
    container.className = `player ${this.identity}`;
    container.id = this.identity;

    this.container = container;
    return container
  }

  bindEvent(query, cb) {
    if (!cb) {
      throw new Error('you should provide a callback');
    }
    const dom = this.container.querySelector(query);
    if (!dom) {
      throw new Error('can\'t bind event: ', query);
    }
    dom.addEventListener('click', event => cb(this, event), false)
  }

  onRichi(cb) {
    this.bindEvent('.richi', cb)
  }

  onRon(cb) {
    this.bindEvent('.ron', cb)
  }

  onTsumo(cb) {
    this.bindEvent('.tsumo', cb)
  }

  update() {
    if (!this.container) {
      throw new Error('you should call player render() before update...')
    }

    const {
      richi,
      score
    } = this;
    const richiButton = this.container.querySelector('.richi');
    const scoreContainer = this.container.querySelector('.player-score');
    const ronButton = this.container.querySelector('.ron');
    const tsumoButton = this.container.querySelector('.tsumo');

    richiButton.classList.remove('active');

    if (richi) {
      richiButton.classList.add('active');
    }

    if (this.isShowResult) {
      scoreContainer.innerHTML =
        `<span class="score-result-container">${this.record}<span class="score-result"><br/>${this.result}</span></span>`
      richiButton.disabled = true;
      ronButton.disabled = true;
      tsumoButton.disabled = true;
    } else {
      scoreContainer.innerHTML = score;
      richiButton.disabled = false;
      ronButton.disabled = false;
      tsumoButton.disabled = false;
    }
  }
}
