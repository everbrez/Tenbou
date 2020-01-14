class Dialog {
  constructor() {
    const instance = document.querySelector('.dialog');
    if (instance) {
      instance.remove();
    }
  }

  showUserConfigDialog() {
    return new Promise((resolve) => {
      const currentPlayersConfig = Setting.getPlayersConfig();
      let startPos = 1;

      function getPosition(startPos, index) {
        return '东南西北'[(index - startPos + 5) % 4]
      }

      const htmlTemplate =
        `<div class="dialog-container">
          <form id="player-name-form">
            ${currentPlayersConfig.map((name, index) => `
              <div>
              <label for="player${index + 1}">
                <span class="position">${getPosition(startPos, index)}</span>:
                <input placeholder="${name}" name="player${index + 1}" id="player${index + 1}">
              </label>
              </div>
            `).join('')}
            <div class="buttons-container">
              <button type="button" id="random-direction-button">random direction</button>
            <button type="button" id="random-name-button">random name</button>
            <button type="submit" id="submit-button">submit</button>
            </div>
          </form>
        </div>`;

      const container = document.createElement('div');
      container.className = 'dialog user-name-dialog';
      container.innerHTML = htmlTemplate;
      document.body.append(container);

      const player1Dom = container.querySelector('#player1');
      const player2Dom = container.querySelector('#player2');
      const player3Dom = container.querySelector('#player3');
      const player4Dom = container.querySelector('#player4');
      const randomPosButton = container.querySelector(
        '#random-direction-button');
      const randomNameButton = container.querySelector(
        '#random-name-button');
      const form = container.querySelector('#player-name-form');
      const positions = [...container.querySelectorAll('.position')];


      form.addEventListener('submit', event => {
        const players = [player1Dom, player2Dom, player3Dom,
          player4Dom
        ]
          .map(dom => dom.value || dom.placeholder);

        Setting.setPlayersConfig(players);

        container.remove();
        resolve(players.map((name, index) => {
          return {
            id: index,
            name,
            position: getPosition(startPos, index),
          };
        }));
        event.preventDefault();
        event.stopPropagation();
      }, false);

      randomPosButton.addEventListener('click', () => {
        let temp = startPos;
        while (temp === startPos) {
          startPos = Math.floor(Math.random() * 4);
        }

        positions.forEach((el, index) => {
          el.innerHTML = '东南西北'[(index - startPos + 1 + 4) % 4];
        });
      });

      randomNameButton.addEventListener('click', () => {
        const names = window.getRandomNames();
        player1Dom.value = names[0];
        player2Dom.value = names[1];
        player3Dom.value = names[2];
        player4Dom.value = names[3];
      });
    });
  }

  // TODO: 添加骰子功能
  showDiceDialog() {
    return new Promise(resolve => {

    });
  }

  getRoundEndCommonDialog(submitCb, cancelCb) {
    const fans = ['1翻', '2翻', '3翻', '4翻', '满贯（3/4-5翻）', '跳满（6-7翻）', '倍满（8-10翻）', '三倍满（11-12翻）']
      .concat(Setting.getSetting()['累计役满'] ? ['役满/累计役满'] : ['役满'])
      .concat(Setting.getSetting()['多倍役满/役满复合'] ? ['两倍役满', '三倍役满', '四倍役满', '五倍役满', '六倍役满'
      ] : []);
    const fus = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

    const htmlTemplate =
      `<div class="dialog-container">
        <form id="round-end-form">
          <div>
            <span class="form-label">选择翻：</span>
            <div class="form-field">
            ${fans.map((fan, index) => `
              <label for="fan-${index}">
                <input type="radio" id="fan-${index}" name="fan" value="${index}" ${index ? '' : 'checked'}>
              ${fan}</label>
            `).join('')}
            </div>
          </div>

          <div>
            <span class="form-label">选择符：</span>
            <div class="form-field">
            ${fus.map((fu, index) => `
              <label for="fu-${fu}">
                <input type="radio" id="fu-${fu}" name="fu" value="${fu}" ${index === 2 ? 'checked' : ''} ${index < 2 ? "disabled" : ""}>
              ${fu}符</label>
            `).join('')}
            </div>
          </div>

          <div class="roundend-button-container">
            <button type="submit">确定</button>
            <button type="button" id="cancel-button">cancel</button>
          </div>
        </form>
      </div>`;

    const container = document.createElement('div');
    container.innerHTML = htmlTemplate;

    const cancelButton = container.querySelector('#cancel-button');
    const roundEndForm = container.querySelector('#round-end-form');

    cancelButton.addEventListener('click', cancelCb, false);
    roundEndForm.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(roundEndForm);
      submitCb(formData);
    }, false);

    roundEndForm.addEventListener('change', event => {
      if (event.target.name === 'fan') {
        const fan = +event.target.value;
        const setting = Setting.getSetting();

        const fuInputs = [...document.getElementsByName('fu')];
        fuInputs.forEach(input => input.disabled = false);

        // 大于等于满贯，不用选择符
        if (fan >= 4) {
          fuInputs.forEach(input => {
            input.disabled = true;
            input.checked = false;
          });
        }
        //  4 翻，40+(false) 30+(true)
        else if (fan === 3) {
          const boundary = setting['切上满贯'] ? 30 : 40;
          fuInputs.forEach(input => {
            if (input.value >= boundary) {
              input.disabled = true;
            }
          });
          fuInputs[0].checked = true;
        }
        // 3 翻
        else if (fan === 2) {
          const boundary = setting['切上满贯'] ? 60 : 70;
          fuInputs.forEach(input => {
            if (input.value >= boundary) {
              input.disabled = true;
            }
          });
          fuInputs[0].checked = true;
        }
        // 等于 1 翻， 禁止 20, 25 符
        else if (fan === 0) {
          fuInputs[2].disabled = fuInputs[2].disabled = true;
          fuInputs[2].checked = true;
        }
      }
    }, false);

    return container;
  }

  // used to be showRoundEndDialog
  showRonDialog() {
    return new Promise(resolve => {
      const loser = ['上家', '对家', '下家'];
      const loserSelectHtmlTemplate = `
        <span class="form-label">放铳玩家：</span>
        <div class="form-field">
          ${loser.map((loser, index) => `
          <label for="loser-${index}">
            <input type="radio" required id="loser-${index}" name="loser" value="${index}">
            ${loser}</label>
          `).join('')}
        </div>`

      const loserSelectFormItem = document.createElement('div');
      loserSelectFormItem.innerHTML = loserSelectHtmlTemplate;

      const container = document.createElement('div');

      const submitCb = (formData) => {
        const data = {};
        for (const entry of formData) {
          const [field, value] = entry;
          data[field] = +value;
        }

        container.remove();
        resolve(data);
      }

      const cancelCb = (event) => {
        container.remove();
        resolve(false);
      }

      const common = this.getRoundEndCommonDialog(submitCb, cancelCb);
      const form = common.querySelector('#round-end-form');
      form.insertBefore(loserSelectFormItem, form.children[0]);

      container.append(common);
      container.className = 'dialog';
      document.body.append(container);
    });
  }

  showTsumoDialog() {
    return new Promise(resolve => {
      const container = document.createElement('div');

      const submitCb = (formData) => {
        const data = {};
        for (const entry of formData) {
          const [field, value] = entry;
          data[field] = +value;
        }

        container.remove();
        resolve(data);
      }

      const cancelCb = (event) => {
        container.remove();
        resolve(false);
      }

      const common = this.getRoundEndCommonDialog(submitCb, cancelCb);

      container.append(common)
      container.className = 'dialog';
      document.body.append(container);
    });
  }

  showMultiRonDialog() {
    return new Promise(resolve => {
      const players = getPlayers();
      const htmlTemplate =
        `<div class="dialog-container">
          <form id="multiRon-form">
            <div>
              <span class="form-label">放铳玩家：</span>
              <div class="form-field">
                ${players.map((player, index) => `
                <label for="loser-${index}">
                  <input type="radio" name="loser" id="loser-${index}" value="${player.id}">
                  ${player.name}
                </label>
                `).join('')}
              </div>
            </div>

            <div>
              <span class="form-label">和牌玩家：</span>
              <div class="form-field">
                ${players.map((player, index) => `
                <label for="ron-${index}">
                  <input type="checkbox" name="ron" id="ron-${index}" value="${player.id}">
                  ${player.name}
                </label>
                `).join('')}
              </div>
            </div>

            <div class="multi-buttons-container">
              <button type="submit">submit</button>
              <button type="button" id="cancel-button">cancel</button>
            </div>
          </form>
        </div>`;

      const container = document.createElement('div');
      container.className = 'dialog';
      container.innerHTML = htmlTemplate;

      document.body.appendChild(container);

      const form = container.querySelector('#multiRon-form');
      const cancelButton = container.querySelector('#cancel-button');

      form.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(form);

        const result = {
          loser: formData.get('loser'),
          ron: formData.getAll('ron')
        };

        container.remove();
        resolve(result);
      }, false);

      cancelButton.addEventListener('click', () => {
        container.remove();
        resolve(false);
      }, false);
    });
  }

  showRyukyokuDialog() {
    return new Promise(resolve => {
      const options = ['荒牌流局'].concat(Setting.getSetting()['途中流局'].concat(
        Setting.getSetting()['流局满贯'] ? ['流局满贯'] : []));
      const players = getPlayers();
      const htmlTemplate =
        `<div class="dialog-container">
          <form id="draw-form">
            <span class="form-label">流局类型：</span>
            <div class="form-field">
              ${options.map((type, index) => `
              <label for="draw-${index}">
                <input type="radio" value="${type}" name="draw-type" id="draw-${index}" ${index ? '' : 'checked'}/>
                ${type}
              </label>
              `).join('')}
            </div>
            <div class="draw-player-checkbox form-field">
            <span class="form-label">听牌玩家：</span>
              ${players.map(player => `
                <label for="player-${player.id}">
                  <input type="checkbox" id="player-${player.id}" name="players" value="${player.id}"/>
                  ${player.name}
                </label>
              `).join('')}
            </div>
            <div class="draw-button-containers">
              <button type="submit">submit</button>
              <button type="button" id="cancel-button">cancel</button>
            </div>
          </form>
        </div>`;

      const container = document.createElement('div');
      container.className = 'dialog';
      container.innerHTML = htmlTemplate;
      document.body.append(container);

      const form = container.querySelector('#draw-form');
      const cancelButton = container.querySelector('#cancel-button');
      const playersCheckbox = container.querySelector('.draw-player-checkbox')
      const playersLabel = playersCheckbox.querySelector('.form-label');

      form.addEventListener('change', event => {
        const inputEl = event.target
        if (inputEl.name === 'draw-type') {
          if ([options[0], options[options.length - 1]].includes(inputEl.value)) {
            playersCheckbox.classList.remove('visibility-hidden');
            if (inputEl.value === '荒牌流局') {
              playersLabel.innerHTML = '听牌玩家';
            }
            if (inputEl.value === '流局满贯') {
              playersLabel.innerHTML = '完成玩家';
            }
            return
          }
          playersCheckbox.classList.add('visibility-hidden');
        }
      })
      form.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(form);

        const type = formData.get('draw-type');
        const players = formData.getAll('players').map(Number);
        container.remove();
        resolve({type, players});
      }, false);

      cancelButton.addEventListener('click', () => {
        container.remove();
        resolve(false);
      }, false);
    });
  }

  //TODO: torewrite
  showResultDialog() {
    const players = getPlayers();
    players.sort((player1, player2) => player2.score - player1.score);

    return new Promise(resolve => {
      const htmlTemplate =
        `<div class="dialog-container">
          <h1>Result</h1>
          ${players.map((player, index) => `
          <div class="result-player ${index ? '' : 'winner'}">
            <span class="player-name">
              ${player.name}
            </span>
            <span class="player-score">
              ${player.score}
            </span>
          </div>
          `).join('')}

          <div class="result-buttons-container">
            <button id="continue-button">继续</button>
            <button id="end-button">结束</button>
          </div>
        </div>`;

      const container = document.createElement('div');
      container.className = 'dialog';
      container.innerHTML = htmlTemplate;
      document.body.append(container);

      const continueButton = container.querySelector('#continue-button');
      const endButton = container.querySelector('#end-button');

      continueButton.addEventListener('click', () => {
        container.remove();
        resolve(true);
      }, false)

      endButton.addEventListener('click', () => {
        container.remove();
        resolve(false);
      }, false);
    });
  }
}
