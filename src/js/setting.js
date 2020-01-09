window.addEventListener('load', main, false);

function main() {
  showSetting();
}

function showSetting() {
  const config = Setting.config;
  const currentSetting = Setting.getSetting();
  // 0: 'bool',
  // 1: 'singleNumber',
  // 2: 'multiNumber',
  // 3: 'singleSelect',
  // 4: 'multiSelect'

  const htmlSetting = Object.keys(config).map(key => {
    const configItem = config[key];
    configItem.default = currentSetting[key];

    switch (configItem.pattern) {
      case 0:
        return `
            <div>
              <span class="form-label">${key}：</span>
              <div class="form-field">
                <label for="${key}-yes">
                  <input type="radio" name="${key}" id="${key}-yes" value="true" ${configItem.default ? 'checked' : ''}>
                  是
                </label>
                <label for="${key}-no">
                  <input type="radio" name="${key}" id="${key}-no" value="" ${configItem.default ? '' : 'checked'}>
                  否
                </label>
              </div>
            </div>`;

      case 1:
        return `
            <div>
              <span class="form-label">${key}：</span>
              <div class="form-field">
                <input type="number" name="${key}" id="${key}" value="${configItem.default}" step="${configItem.step}">
              </div>
            </div>`;

      case 2:
        return `
            <div>
              <span class="form-label">${key}：</span>
              <div class="form-field">
                ${configItem.default.map(num => `
                <input type="number" name="${key}" value="${num}" step="${configItem.step}">
                `).join('')}
              </div>
            </div>`;

      case 3:
        return `
            <div>
              <span class="form-label">${key}：</span>
              <div class="form-field">
                ${configItem.list.map(item => `
                <label for="${key}-${item}">
                  <input type="radio" name="${key}" id="${key}-${item}" value="${item}" ${configItem.default === item ? 'checked' : ''}>
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
                ${configItem.list.map(item => `
                <label>
                  <input type="checkbox" name="${key}" id="${key}-${item}" value="${item}" ${configItem.default.includes(item) ? 'checked' : ''}>
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
            <button type="button" id="default-config-button">恢复默认设置</button>
          </div>
        </form>
      </div>`;

  const container = document.createElement('div');
  container.className = 'dialog';
  container.innerHTML = htmlTemplate;
  document.body.append(container);

  const form = container.querySelector('#config-form');
  const defaultConfigButton = container.querySelector(
    '#default-config-button');

  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(form);
    const newSetting = {};
    Object.keys(config).map(key => {
      const configItem = config[key];
      switch (configItem.pattern) {
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

    Setting.setSetting(newSetting);
    backToIndex();
  }, false);

  defaultConfigButton.addEventListener('click', () => {
    Setting.reset();
    container.remove();
    showSetting();
  }, false);

  function backToIndex() {
    location.href = '../html/getStarted.html';
  }
}
