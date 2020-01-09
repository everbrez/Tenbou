class Dialog {
  constructor() {
    const instance = document.querySelector('.dialog');
    if (instance) {
      instance.remove();
    }
  }

  showUserConfigDialog() {
    return new Promise((resolve) => {
      const htmlTemplate =
        `<div class="dialog-container">
          <form id="player-name-form">
            <div>
            <label for="player1">
              <span class="position">东</span>:
              <input placeholder="player1" name="player1" id="player1">
            </label>
            </div>

            <div>
            <label for="player2">
              <span class="position">南</span>:
              <input placeholder="player2" name="player2" id="player2">
            </label>
            </div>

            <div>
            <label for="player3">
              <span class="position">西</span>:
              <input placeholder="player3" name="player3" id="player3">
            </label>
            </div>

            <div>
            <label for="player4">
              <span class="position">北</span>:
              <input placeholder="player4" name="player4" id="player4">
            </label>
            </div>

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
      const randomPosButton = container.querySelector('#random-direction-button');
      const randomNameButton = container.querySelector('#random-name-button');
      const form = container.querySelector('#player-name-form');
      const positions = [...container.querySelectorAll('.position')];

      let startPos = 1;

      form.addEventListener('submit', event => {
        const players = [player1Dom, player2Dom, player3Dom, player4Dom]
          .map(dom => dom.value || dom.placeholder);

        container.remove();
        resolve(players.map((name, index) => {
          return {
            id: index,
            name,
            position: '东南西北'[(index - startPos + 5) % 4],
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

  // used to be showRoundEndDialog
  showRonDialog() {
    return new Promise(resolve => {
      const loser = ['上家', '对家', '下家'];
      const fans = ['1翻', '2翻', '3翻', '4翻', '满贯（3/4-5翻）', '跳满（6-7翻）', '倍满（8-10翻）', '三倍满（11-12翻）']
        .concat(getSetting()['累计役满'] ? ['役满/累计役满'] : ['役满'])
        .concat(getSetting()['多倍役满/役满复合'] ? ['两倍役满', '三倍役满', '四倍役满', '五倍役满', '六倍役满'] : []);
      const fus = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

      const htmlTemplate =
        `<div class="dialog-container">
          <form id="round-end-form">
            <div>
              <span class="form-label">放铳玩家：</span>
              <div class="form-field">
                ${loser.map((loser, index) => `
                <label for="loser-${index}">
                  <input type="radio" id="loser-${index}" name="loser" value="${index}">
                ${loser}</label>
                `).join('')}
              </div>
            </div>

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
                <label for="fu-${index}">
                  <input type="radio" id="fu-${index}" name="fu" value="${fu}" ${index ? '' : 'checked'}>
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
      container.className = 'dialog';
      container.innerHTML = htmlTemplate;

      document.body.append(container);

      const cancelButton = container.querySelector('#cancel-button');
      const roundEndForm = container.querySelector('#round-end-form');

      cancelButton.addEventListener('click', () => {
        container.remove();
        resolve(false);
      });
      roundEndForm.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();
        const formData = new FormData(roundEndForm);

        if (!formData.has('loser')) {
          alert('请填写放铳玩家');
          return;
        }

        const data = {};
        for (const entry of formData) {
          const [field, value] = entry;
          data[field] = +value;
        }

        container.remove();
        resolve(data);
      }, false);
    });
  }

  showTsumoDialog() {
    return new Promise(resolve => {

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
      const options = ['荒牌流局'].concat(getSetting()['途中流局'].concat(getSetting()['流局满贯'] ? ['流局满贯'] : []));
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
      form.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(form);

        const data = formData.get('draw-type');
        container.remove();
        resolve(data);
      }, false);

      cancelButton.addEventListener('click', () => {
        container.remove();
        resolve(false);
      }, false);
    });
  }

  // move to html file.
  showConfigDialog() {
    return new Promise(resolve => {
      const setting = window.configSetting;
      // 0: 'bool',
      // 1: 'singleNumber',
      // 2: 'multiNumber',
      // 3: 'singleSelect',
      // 4: 'multiSelect'

      const htmlSetting = Object.keys(setting).map(key => {
        const config = setting[key];
        switch (config.pattern) {
          case 0:
            return `
              <div>
                <span class="form-label">${key}：</span>
                <div class="form-field">
                  <label for="${key}-yes">
                    <input type="radio" name="${key}" id="${key}-yes" value="true" ${config.default ? 'checked' : ''}>
                    是
                  </label>
                  <label for="${key}-no">
                    <input type="radio" name="${key}" id="${key}-no" value="" ${config.default ? '' : 'checked'}>
                    否
                  </label>
                </div>
              </div>`;

          case 1:
            return `
              <div>
                <span class="form-label">${key}：</span>
                <div class="form-field">
                  <input type="number" name="${key}" id="${key}" value="${config.default}">
                </div>
              </div>`;

          case 2:
            return `
              <div>
                <span class="form-label">${key}：</span>
                <div class="form-field">
                  ${config.default.map(num => `
                  <input type="number" name="${key}" value="${num}">
                  `).join('')}
                </div>
              </div>`;

          case 3:
            return `
              <div>
                <span class="form-label">${key}：</span>
                <div class="form-field">
                  ${config.list.map(item => `
                  <label for="${key}-${item}">
                    <input type="radio" name="${key}" id="${key}-${item}" value="${item}" ${config.default === item ? 'checked' : ''}>
                    ${item}
                  </label>
                  `).join('')}
                </div>
              </div>`;

          case 4:
            return `
              <div>
                <span class="form-label">${key}：</span>
                <div class="form-field">
                  ${config.list.map(item => `
                  <label>
                    <input type="checkbox" name="${key}" id="${key}-${item}" value="${item}" ${config.default.includes(item) ? 'checked' : ''}>
                    ${item}
                  </label>
                  `).join('')}
                </div>
              </div>`;

          default:
            return '';
        }
      }).join('');

      const htmlTemplate =
        `<div class="dialog-container">
          <form id="config-form">
            ${htmlSetting}
            <div class="config-buttons-container">
              <button type="submit">submit</button>
              <button type="button" id="default-config-button">use default setting</button>
            </div>
          </form>
        </div>`;

      const container = document.createElement('div');
      container.className = 'dialog';
      container.innerHTML = htmlTemplate;
      document.body.append(container);

      const form = container.querySelector('#config-form');
      const defaultConfigButton = container.querySelector('#default-config-button');

      form.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(form);
        const newSetting = {};
        Object.keys(setting).map(key => {
          const config = setting[key];
          switch (config.pattern) {
            case 0:
              newSetting[key] = !!formData.get(key);
              break;
            case 1:
              newSetting[key] = +formData.get(key);
              break;
            case 2:
              newSetting[key] = formData.getAll(key).map(Number);
              break;
            case 3:
              newSetting[key] = formData.get(key);
              break;
            case 4:
              newSetting[key] = formData.getAll(key);
              break;
            default:
          }
        });

        container.remove();
        setSetting(newSetting);
        resolve(newSetting);
      }, false);

      //TODO: to rewrite
      defaultConfigButton.addEventListener('click', () => {
        container.remove();
        resolve(window.configSetting);
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
