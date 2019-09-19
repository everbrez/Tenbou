class Game {
    position = { 0: '东', 1: '南', 2: '西', 3: '北' };

    settingPattern = {
        0: 'bool',
        1: 'singleNumber',
        2: 'multiNumber',
        3: 'singleSelect',
        4: 'multiSelect'
    }

    setting = {
        '模式': { pattern: 3, list: ['四人东', '四人南'], default: 0, select: 0 },
        '起始点数': { pattern: 1, default: 25000, select: 25000 },
        '1位必要点数': { pattern: 1, default: 30000, select: 30000 },
        '南入/西入': { pattern: 0, default: true, select: true },
        '击飞': { pattern: 0, default: true, select: true },
        '天边': { pattern: 1, default: 0, select: 0 },
        '途中流局': { pattern: 4, list: ['四风连打', '四杠散了', '四家立直', '九种九牌', '三家和了'], default: [0, 1, 2, 3, 4], select: [0, 1, 2, 3, 4] },
        '不听罚符': { pattern: 2, default: [1000, 1500, 3000], select: [1000, 1500, 3000] },
        '立直棒点数': { pattern: 1, default: 1000, select: 1000 },
        '场棒点数': { pattern: 1, default: 300, select: 300 },
        '精算原点': { pattern: 1, default: 25000, select: 25000 },
        '顺位马点': { pattern: 2, default: [+15, +5, -5, -15], select: [+15, +5, -5, -15] },
        '头名赏': { pattern: 1, default: 0, select: 0 },
        '切上满贯': { pattern: 0, default: false, select: false },
        '头跳': { pattern: 0, default: false, select: false },
        '和牌连庄': { pattern: 0, default: true, select: true },
        '和了终局': { pattern: 0, default: true, select: true },
        '听牌连庄': { pattern: 0, default: true, select: true },
        '听牌终局': { pattern: 0, default: true, select: true },
        '多倍役满': { pattern: 0, default: true, select: true },
    };

    history = [];

    constructor() {

    }
}

class Round {
    constructor() {

    }
}