class Dialog {
  constructor() {
    const instance = document.querySelector('.dialog');
    if (instance) {
      // instance.remove();
    }
  }
  showUserConfigDialog() {
    return new Promise((resolve, reject) => {
      const htmlTemplate = `
    <div class="dialog-container">
      <form id="player-name-form">
        <div class="field-name">
          <label for="player1">
            <span class="position">东</span>:
            <input placeholder="player1" name="player1" id="player1">
          </label>

          <label for="player2">
            <span class="position">南</span>:
            <input placeholder="player2" name="player2" id="player2">
          </label>
          <label for="player3">
            <span class="position">西</span>:
            <input placeholder="player3" name="player3" id="player3">
          </label>
          <label for="player4">
            <span class="position">北</span>:
            <input placeholder="player4" name="player4" id="player4">
          </label>
            <div class="buttons-container">
              <button type="button" id="random-direction-button">random direction</button>
            <button type="button" id="random-name-button">random name</button>
            <button type="submit" id="submit-button">submit</button>
            </div>
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

      let startPos = 1;

      form.addEventListener('submit', event => {
        const players = [player1Dom,
          player2Dom, player3Dom, player4Dom
        ].map(dom => dom.value || dom.placeholder);

        container.remove();
        resolve(players.map((name, index) => {
          return new Player({
            id: index + 1,
            name,
            position: '东南西北'[(index - startPos +
              1 + 4) % 4],
          });
        }));
        event.preventDefault();
        event.stopPropagation();
      }, false);

      randomPosButton.addEventListener('click', () => {
        startPos = Math.floor(Math.random() * 4);
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
      })
    })
  }

  showDiceDialog() {
    return new Promise(resolve => {

    });
  }

  showRoundEndDialog(isTsumo = false) {
    return new Promise(resolve => {
      const loser = ['上家', '对家', '下家'];
      const fans = ['1翻', '2翻', '3翻', '4翻', '满贯（4-5翻）', '跳满（6-7翻）', '倍满（8-10翻）',
        '三倍满（11-12翻）', '役满', '2倍役满', '3倍役满', '4倍役满', '5倍役满', '6倍役满'
      ];
      const fus = ['20符', '25符', '30符', '40符', '50符', '60符', '70符', '80符',
        '90符', '100符', '110符'
      ];

      const htmlTemplate = `
      <div class="dialog-container">
      <form id="round-end-form">
        <div>
          ${isTsumo ? '' : loser.map((loser, index) => `
          <label for="loser-${index}">
            <input type="radio" id="loser-${index}" name="loser" value="${loser}">
          ${loser}</label>
          `).join('')}
        </div>

        <div>
        ${fans.map((fan, index) => `
          <label for="fan-${index}">
            <input type="radio" id="fan-${index}" name="fan" value="${fan}" ${index ? '' : 'checked'}>
          ${fan}</label>
        `).join('')}
        </div>

        <div>
        ${fus.map((fu, index) => `
          <label for="fu-${index}">
            <input type="radio" id="fu-${index}" name="fu" value="${fu}" ${index ? '' : 'checked'}>
          ${fu}</label>
        `).join('')}
        </div>
        <button type="submit">确定</button>
        <button type="button" id="cancel-button">cancel</button>
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
        const result = {};
        let count = 0;
        for (const entry of formData) {
          const [field, value] = entry;
          result[field] = value;
          count += 1;
        }
        if (count < 3 && !isTsumo) {
          alert('请填写放铳玩家');
          return;
        }
        container.remove();
        resolve(result);
      }, false);
    });
  }

  showDrawDialog() {
    return new Promise(resolve => {
      const options = ['普通流局', '途中流局（连庄）', '途中流局（轮庄）', '特殊流局'];
      const htmlTemplate = `
      <div class="dialog-container">
        <form id="draw-form">
          <select name="draw" id="draw">
            ${options.map(option => `
              <option value="${option}">${option}</option>
            `).join('')}
          </select>
          <button type="submit">submit</button>
          <button type="button" id="cancel-button">cancel</button>
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

        const data = formData.get('draw');
        container.remove();
        resolve(data);
      }, false);

      cancelButton.addEventListener('click', () => {
        container.remove();
        resolve(false);
      }, false);
    });
  }

  showMultiRonDialog(players) {
    return new Promise(resolve => {
      const htmlTemplate = `
      <div class="dialog-container">
        <form id="multiRon-form">
          <div>
            放铳玩家:
            ${players.map((player, index) => `
            <label for="loser-${index}">
              <input type="radio" name="loser" id="loser-${index}" value="${player.id}">
            </label>
            `).join('')}
          </div>

          <div>
            和牌玩家:
            ${players.map((player, index) => `
            <label for="ron-${index}">
              <input type="checkbox" name="ron" id="ron-${index}" value="${player.id}">
            </label>
            `).join('')}
          </div>

          <button type="submit">submit</button>
          <button type="button" id="cancel-button">cancel</button>
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

        console.log(result);
        container.remove();
        resolve(result);
      }, false);

      cancelButton.addEventListener('click', () => {
        container.remove();
        resolve(false);
      }, false);
    });
  }
}
