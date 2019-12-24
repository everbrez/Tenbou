class Dialog {
  async showUserConfigDialog() {
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
    </div>`

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
            position: '东南西北' [(index - startPos +
              1 + 4) % 4],
          })
        }));
        event.preventDefault();
        event.stopPropagation();
      }, false);

      randomPosButton.addEventListener('click', () => {
        startPos = Math.floor(Math.random() * 4);
        positions.forEach((el, index) => {
          el.innerHTML = '东南西北' [(index - startPos + 1 + 4) % 4];
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

  async showDiceDialog() {
    return new Promise(resolve => {

    })
  }

  async showRoundEndDialog() {
    return new Promise(resolve => {
      const loser = ['上家', '对家', '下家'];
      const fans = ['1翻', '2翻', '3翻', '4翻', '5翻', '6-7翻', '8-10翻', '11-12翻', '役满', '2倍役满', '3倍役满', '4倍役满', '5倍役满', '6倍役满'];
      const fus = ['20符', '25符', '30符', '40符', '50符', '60符', '70符', '80符', '90符', '100符', '110符'];

      const htmlTemplate = `
      <div class="dialog-container">
      <form id="round-end-form">
        <div>
          ${loser.map((loser, index) => `
          <input type="radio" id="loser-${index}" name="loser" value="${loser}">
          <label for="loser-${index}">${loser}</label>
          `).join('')}
        </div>

        <div>
        ${fans.map((fan, index) => `
          <input type="radio" id="fan-${index}" name="fan" value="${fan}" ${index ? '' : 'checked'}>
          <label for="fan-${index}">${fan}</label>
        `).join('')}
        </div>

        <div>
        ${fus.map((fu, index) => `
          <input type="radio" id="fu-${index}" name="fu" value="${fu}" ${index ? '' : 'checked'}>
          <label for="fu-${index}">${fu}</label>
        `).join('')}
        </div>
        <button type="submit">确定</button>
      </form>
    </div>`

    const container = document.createElement('div');
    container.className = 'dialog';
    container.innerHTML = htmlTemplate;

    document.body.append(container);

    const roundEndForm = container.querySelector('#round-end-form');
    roundEndForm.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(roundEndForm);
      const result = {}
      let count = 0;
      for(const entry of formData) {
        const [field, value] = entry;
        result[field] = value
        count += 1;
      }
      if (count < 3) {
        alert('请填写放铳玩家')
        return;
      }
      container.remove();
      resolve(result);
    }, false)
    })
  }
}
