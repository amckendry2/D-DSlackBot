function standardRollStringBuilder(rollObj){
  var actionText = standardRollActionStringBuilder(rollObj);
  var resultText = standardRollResultStringBuilder(rollObj);
  var returnText = actionText + '\n' + resultText;
  return returnText;
}

function standardRollActionStringBuilder(rollObj) {
  Logger.log(rollObj);
  if (!rollObj.rolled){
    return '';
  }
  var actionString = ' rolled ';
  var itemList = rollObj.itemList;
  for (var i = 0; i < itemList.length; i++){
    var item = itemList[i];
    if (i > 0){
      actionString += getSign(item.value) + ' ';
    }
    var val = (item.type === 'roll') ? item.rollInput : String(item.value);
    val += item.crit ? ' [CRIT]' : ''
    actionString += val + ' ';
  }
  return actionString;
}

function standardRollResultStringBuilder(rollObj){
  var resultString = '*Result:* ';
  var itemList = rollObj.itemList;
  for (var i = 0; i < itemList.length; i++){
    var item = itemList[i];
    var val;
    if (i > 0){
      resultString += getSign(item.value) + ' ';
    }
    if (item.type === 'roll'){
      var rolls = item.rollList;
      var rollString = '(';
      for (var j = 0; j < rolls.length; j++){
        rollString += rolls[j];
        rollString += (j === rolls.length-1 ? ')' : ',');
      }
      val = rollString;
    }else if (item.type === 'integer'){
      val = String(item.value);
    }
    resultString += val + ' ';
  }
  resultString += '= ' + rollObj.total;
  return resultString;
}

function newAbilityRollStringBuilder(obj){
  var resultString = '';
  var advString = '';
  if (obj.adv.has){
    if (obj.adv.type === 'adv'){
      advString += ' with advantage!';
    }else if (obj.adv.type === 'dis'){
      advString += ' with disadvantage!';
    }
  }else{
    advString += '!'
  }
  resultString += advString + '\n';
  
  var rollString = '*ROLL:* ';
  if (obj.adv.has){
    rollString += '(' + obj.rolls.itemList[0] + ') vs (' 
    + obj.rolls.itemList[1] + ') = ' + obj.rolls.total;
  }else{
    rollString += '(' + obj.rolls.itemList[0] + ')'
  }
  resultString += rollString + '\n';
  
  if (obj.ability.has){
    var abilityString = '';
    var abilityName = makeUpperCase(obj.ability.type);
    abilityString += '*' + abilityName + '*: ' 
    + getSign(obj.ability.value) + obj.ability.value;
    resultString += abilityString + '\n';
  }
  var profString = '';
  if (obj.prof.has){
    profString += '*PROF:* +' + obj.prof.value; 
    resultString += profString + '\n';
  }
  
  if (obj.bonus.has){
    var bonusString = '*BONUS:* +' + obj.bonus.value;
    resultString += bonusString + '\n';
  }
 
  var modString = '';
  if (obj.mod.has){
    modString += '*MOD:* ';
    for (var i = 0; i < obj.mod.itemList.length; i++){
      var item = obj.mod.itemList[i];
      var val = (item.type === 'roll') ? item.rollInput : String(item.value);
      val += item.crit ? ' [CRIT]' : ''
      modString += getSign(item.value) + val;// + ' ';
    }
    if (obj.mod.itemList.length > 1 || obj.mod.itemList[0].type != 'integer'){
      modString += ' = ' + getSign(obj.mod.value) + obj.mod.value;
    }
    resultString += modString + '\n';
  }
  
  return resultString;
}