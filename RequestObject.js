var requestObject = (function(){
  var _obj = 
      {
        params: [],
        userID: '',
        ability: {
          has: false,
          type: '',
          value: 0
        },
        skill: {
          has: false,
          type: ''
        },
        bonus: {
          has: false,
          value: 0
        },
        char: {
          name: '',
          charData: {}
        },
        rolls: {
          itemList: [],
          total: 0
        },
        adv: {
          has: false,
          type: ''
        },
        mod: {
          has: false,
          itemList: [],
          value: 0
        },
        prof: {
          has: false,
          value: 0
        },
        totalScore: 0
      };          
  return {
    getData: function(){
      return _obj;
    },
    setUserID: function(userID){
      _obj.userID = userID;
      return this;
    },
    setAbility: function(type, value){
      _obj.ability.has = true;
      _obj.ability.type = type;
      _obj.ability.value = value;
      return this;
    },
    setSkill: function(type){
      _obj.skill.type = type;
      return this;
    },
    setChar: function(charName, charData){
      _obj.char.name = charName;
      _obj.char.charData = charData;
      return this;
    },
    setRolls: function(itemList, total){
      _obj.rolls.itemList = itemList;
      _obj.rolls.total = total;
      return this;
    },
    setBonus: function(value){
      _obj.bonus.has = true;
      _obj.bonus.value = value;
      return this;
    },
    setAdv: function(advType){
      _obj.adv.has = true;
      _obj.adv.type = advType; 
      return this;
    },
    setMod: function(list, value){
      _obj.mod.has = true;
      _obj.mod.itemList = list;
      _obj.mod.value = value;
      return this;
    },
    setProf: function(value){
      _obj.prof.has = true;
      _obj.prof.value = value;
      return this;
    },
    setTotalScore: function(totalScore){
      _obj.totalScore = totalScore;
      return this;
    },
    setParams: function(params){
      _obj.params = params;
      return this;
    }
  }
})();