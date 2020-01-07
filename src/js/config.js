// 0: 'bool',
// 1: 'singleNumber',
// 2: 'multiNumber',
// 3: 'singleSelect',
// 4: 'multiSelect'
window.configSetting = {
  '模式': {
    pattern: 3,
    list: ['四人东', '四人南'],
    default: '四人南'
  },
  '起始点数': {
    pattern: 2,
    default: [25000, 25000, 25000, 25000],
    checker: (xs) => {

    }
  },
  '1位必要点数': {
    pattern: 1,
    default: 30000,
    checker: (x) => {

    }
  },
  '南入/西入': {
    pattern: 0,
    default: true
  },
  '击飞': {
    pattern: 0,
    default: true
  },
  '天边': {
    pattern: 1,
    default: 0,
    checker: (x) => {

    }
  },
  '途中流局': {
    pattern: 4,
    list: ['四风连打', '四杠散了', '四家立直', '九种九牌', '三家和了'],
    default: ['四风连打', '四杠散了', '四家立直', '九种九牌', '三家和了']
  },
  '流局满贯': {
    pattern: 0,
    default: true
  },
  '不听罚符': {
    pattern: 2,
    default: [1000, 1500, 3000],
    checker: (xs) => {

    }
  },
  '立直棒点数': {
    pattern: 1,
    default: 1000,
    checker: (x) => {

    }
  },
  '场棒点数': {
    pattern: 1,
    default: 300,
    checker: (x) => {

    }
  },
  '返点': {
    pattern: 1,
    default: 25000,
    checker: (x) => {

    }
  },
  '顺位马点': {
    pattern: 2,
    default: [+15, +5, -5, -15],
    checker: (xs) => {

    }
  },
  '切上满贯': {
    pattern: 0,
    default: false
  },
  '头跳': {
    pattern: 0,
    default: false
  },
  '和牌连庄': {
    pattern: 0,
    default: true
  },
  '和了终局': {
    pattern: 0,
    default: true
  },
  '听牌连庄': {
    pattern: 0,
    default: true
  },
  '听牌终局': {
    pattern: 0,
    default: true
  },
  '累计役满': {
    pattern: 0,
    default: true
  },
  '多倍役满/役满复合': {
    pattern: 0,
    default: true
  }
}

window.setting = {
  '模式': '四人南',
  '起始点数': [25000, 25000, 25000, 25000],
  '1位必要点数': 30000,
  '南入/西入': true,
  '击飞': true,
  '天边': 0,
  '途中流局': ['四风连打', '四杠散了', '四家立直', '九种九牌', '三家和了'],
  '流局满贯': true,
  '不听罚符': [1000, 1500, 3000],
  '立直棒点数': 1000,
  '场棒点数': 300,
  '返点': 25000,
  '顺位马点': [+15, +5, -5, -15],
  '切上满贯': false,
  '头跳': false,
  '和牌连庄': true,
  '和了终局': true,
  '听牌连庄': true,
  '听牌终局': true,
  '累计役满': true,
  '多倍役满/役满复合': true
}

window.defaultSetting = {
  '模式': '四人南',
  '起始点数': [25000, 25000, 25000, 25000],
  '1位必要点数': 30000,
  '南入/西入': true,
  '击飞': true,
  '天边': 0,
  '途中流局': ['四风连打', '四杠散了', '四家立直', '九种九牌', '三家和了'],
  '流局满贯': true,
  '不听罚符': [1000, 1500, 3000],
  '立直棒点数': 1000,
  '场棒点数': 300,
  '返点': 25000,
  '顺位马点': [+15, +5, -5, -15],
  '切上满贯': false,
  '头跳': false,
  '和牌连庄': true,
  '和了终局': true,
  '听牌连庄': true,
  '听牌终局': true,
  '累计役满': true,
  '多倍役满/役满复合': true
}

function getSetting() {
  return window.setting;
}

function setSetting(newSetting) {
  window.setting = newSetting;
}

function getDefaultSetting() {
  return window.defaultSetting;
}

function getPlayers() {
  return window.players;
}

function initPlayers(playersConfig) {
  window.players = playersConfig.map(item => new Player(item));
}