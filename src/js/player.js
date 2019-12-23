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

class Player {
  constructor(position, beginPoints, character) {
    this.position = position;
    this.points = beginPoints;
    this.character = character /* {name, avatar} */;
  }
}
