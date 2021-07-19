function rollHandler(_params){
  var params = splitParams(_params.text);
  var type = params.getOptionalParam();
  var rollParams = params.unshift('+');
  var rollObj = parseRolls(params);
  if (rollObj === null){return errorHandler.invalidParameters();}
  var actionText = type ? 'for ' + type : '';
  var output = {};
  output.text = '<@' + _params.user_id + '>';
  output.text += standardRollActionStringBuilder(rollObj) + actionText + '!\n';
  output.text += standardRollResultStringBuilder(rollObj);
  output.response_type = "in_channel";
  output.attachments = [
    {
      "mrkdwn_in": ["text", "title"],
      "title": 'SCORE: ' + rollObj.total + '!'
    }
  ];
  return output;
}

function initiativeHandler(reqData){
  var params = reqData.params;
  params.unshift('dex');
  var obj = d20Handler(params);
  if (obj === null){return errorHandler.invalidParameters();}
  var output = {};
  output.text = '<@' + obj.userID + '> made an initiative roll'
  output.text += newAbilityRollStringBuilder(obj);
  output.response_type = "in_channel";
  output.attachments = [
      {
        "title": obj.char.name + ' rolled an initiative of ' + obj.totalScore + '!'
      }
    ];
  return output;
}

function attackHandler(reqData){
  var params = reqData.params;
  var attackType = params.getOptionalParam();
  params.splice(1,0,'prof');
  var obj = d20Handler(params);
  if (obj === null){return errorHandler.invalidParameters();}
  var critText = obj.rolls.total === 20 ? ' CRITICAL HIT!' : '';
  var attackTypeText = attackType ? 'with ' + attackType + ' ' : '';
  var output = {};
  output.text = '<@' + obj.userID + '> made an attack roll'
  output.text += newAbilityRollStringBuilder(obj);
  output.response_type = "in_channel";
  output.attachments = [
      {
        "title": obj.char.name + ' attacked ' 
        + attackTypeText + 'with a rating of ' 
        + obj.totalScore + '!' + critText
      }
    ];
  return output;
}

function monAttackHandler(reqData){
  var params = reqData.params;
  var monster = params.getOptionalParam();
  var attackBonus = parseInt(params.shift());
  var adv = (params[0] === 'adv' || params[0] === 'dis') ? params.shift() : null;
  var mainRoll = doRollMath((adv ? 2 : 1), 20);
  if (adv){
    if (adv === 'adv'){mainRoll.total = Math.max.apply(Math, mainRoll.rollList);}
    if (adv === 'dis'){mainRoll.total = Math.min.apply(Math, mainRoll.rollList);}
  }
  var modRolls = params.length > 0 ? parseRolls(params) : null;
  if (params.length > 0 && modRolls === null){return errorHandler.invalidParameters();}
  var totalScore = (mainRoll.total + attackBonus + (modRolls? modRolls.total : 0));
  requestObject.setTotalScore(totalScore).setRolls(mainRoll.rollList, mainRoll.total).setBonus(attackBonus);
  if (adv){requestObject.setAdv(adv)};
  if (modRolls){requestObject.setMod(modRolls.itemList, modRolls.total)}
  var obj = requestObject.getData();
  var critText = mainRoll.total === 20 ? ' CRITICAL HIT!' : '';
  var monNameText = monster ? monster : 'Enemy';
  var didHit = reqData.char.charData.ac < totalScore;
  var hitText = didHit ? critText ? critText : '*Attack HIT!*' : '*Attack MISSED!*'
  var output = {};
  output.text = '<@' + reqData.userID + '> made an NPC attack roll' 
  output.text += newAbilityRollStringBuilder(obj);
  output.response_type = "in_channel";
  output.attachments = [
      {
        "mrkdwn_in": ["text", "pretext"],
        "title": monNameText + ' attacked ' + reqData.char.name + ' with a rating of ' + obj.totalScore + '!',
        "text": reqData.char.name +"'s AC: " + reqData.char.charData.ac + '\n' + hitText        
      }
    ];
  return output;
}

function abilityCheckHandler(reqData){
  var charData = reqData.char.charData;
  var params = reqData.params;
  var type = params.getOptionalParam();
  var obj = d20Handler(params);
  if (obj === null){return errorHandler.invalidParameters();}
  var critText = obj.rolls.total === 20 ? ' CRITICAL SUCCESS!' : '';
  var actionText = type ? ' for ' + type : '';
  var output = {};
  output.text = '<@' + obj.userID + '> rolled an ability check' + actionText;
  output.text += newAbilityRollStringBuilder(obj);
  output.response_type = "in_channel";
  output.attachments = [
      {
        "title": obj.char.name + ': ' + obj.ability.type + ' check of ' + obj.totalScore + '!' + critText
      }
    ];
  return output;
}


function skillCheckHandler(reqData){
  var params = reqData.params;
  var type = params.getOptionalParam();
  var charData = reqData.char.charData;
  var skill = makeLowerCase(params.shift());
  params.unshift(skillBonusParser(skill));
  Logger.log(skill);
  if (charData.skill.getSkill(skill) === 1){
    params.splice(1,0,'prof');
  }
  Logger.log(params);
  var obj = d20Handler(params);
  if (obj === null){return errorHandler.invalidParameters();}
  var actionText = type ? ' for ' + type : '';
  var critText = obj.rolls.total === 20 ? ' CRITICAL SUCCESS!' : '';
  var output = {};
  output.text = '<@' + obj.userID + '> rolled a skill check' + actionText;
  output.text += newAbilityRollStringBuilder(obj);
  output.response_type = "in_channel";
  output.attachments = [
      {
        "title": obj.char.name + ': ' + skill + ' check of ' + obj.totalScore + '!' + critText
      }
    ];
  return output;
}

function saveThrowHandler(reqData){
  var params = reqData.params;
  var type = params.getOptionalParam();
  var charData = reqData.char.charData;
  if (charData.skill.getSave(params[0]) === 1){
    params.splice(1,0,'prof');
  }
  var obj = d20Handler(params);
  if (obj === null){return errorHandler.invalidParameters();}
  var actionText = type ? ' for ' + type : '';
  var critText = obj.rolls.total === 20 ? ' CRITICAL SUCCESS!' : '';
  var output = {};
  output.text = '<@' + obj.userID + '> rolled ' + obj.ability.type + ' saving throw' + actionText;
  output.text += newAbilityRollStringBuilder(obj);
  output.response_type = "in_channel";
  output.attachments = [
      {
        "title": obj.char.name + ': ' + obj.ability.type + ' save of ' + obj.totalScore + '!' + critText
      }
    ];
  return output;
}

function hitHandler(reqData){
  var params = reqData.params;
  var charData = reqData.char.charData;
  var damageType = params.getOptionalParam();
  var critIndex;
  var didCrit;
  if (didCrit = (critIndex = params.indexOf('crit')) >= 0){
    params.splice(critIndex,1);
  }
  params.unshift('+');
  var rollObj = parseRolls(params, critIndex);
  if (rollObj === null){return errorHandler.invalidParameters();}
  charData = subHP(charData, rollObj.total);
  var critText = didCrit ? ' critical' : '';
  var damageText = damageType ? ' ' + damageType : '';
  var output = {};
  output.text = '<@' + reqData.userID + '>';
  output.text += standardRollStringBuilder(rollObj);
  output.response_type = "in_channel";
  output.attachments = [
    {
      "title": reqData.char.name + ' took ' + rollObj.total + critText + damageText + ' damage!',
      "text": 'Current HP: ' + charData.hp.current + '/' + charData.hp.max
    }
  ];
  return output;
}

function monHitHandler(reqData){
  var params = reqData.params;
  var charData = reqData.char.charData;
  var monName = params.getOptionalParam();
  var critIndex;
  var didCrit;
  if (didCrit = (critIndex = params.indexOf('crit')) >= 0){
    params.splice(critIndex,1);
  }
  params.unshift('+');
  var rollObj = parseRolls(params, critIndex);
  if (rollObj === null){return errorHandler.invalidParameters();}
  charData = subHP(charData, rollObj.total);
  var critText = didCrit ? ' critical' : '';
  var monNameText = monName ? monName : 'Enemy';
  var output = {};
  output.text = '<@' + reqData.userID + '>';
  output.text += standardRollStringBuilder(rollObj);
  output.response_type = "in_channel";
  output.attachments = [
    {
      "title": monNameText + ' hit ' + reqData.char.name + ' for ' + rollObj.total + critText + ' damage!',
      "text": 'Current HP: ' + charData.hp.current + '/' + charData.hp.max
    }
  ];
  return output;
}
  
function healHandler(reqData){
  var params = reqData.params;
  var charData = reqData.char.charData;
  params.unshift('+');
  var rollObj = parseRolls(params);
  if (rollObj === null){return errorHandler.invalidParameters();}
  charData = addHP(charData, rollObj.total);
  var output = {};
  output.text = '<@' + reqData.userID + '>';
  output.text += standardRollStringBuilder(rollObj);
  output.response_type = "in_channel";
  output.attachments = [
    {
      "title": reqData.char.name + ' healed ' + rollObj.total + ' hp!',
      "text": 'Current HP: ' + charData.hp.current + '/' + charData.hp.max
    }
  ];
  return output;
}

function maxHPHandler(reqData){
  if (reqData.params.length > 0){return errorHandler.invalidParameters();}
  var charData = reqData.char.charData;
  charData.hp.set(charData.hp.max);
  var output = {};
  output.text = '<@' + reqData.userID + '>';
  output.response_type = "in_channel";
  output.attachments = [
    {
      "title": reqData.char.name + ' maxed out hp!',
      "text": 'Current HP: ' + charData.hp.current + '/' + charData.hp.max
    }
   ];
   return output;
}

function useHDHandler(reqData){
  if (reqData.params.length > 0){return errorHandler.invalidParameters();}
  var charData = reqData.char.charData;
  if (charData.hd.current <= 0){
    return {
      "text": reqData.char.name + ' has no remaining hit die!\n' +
      'Hit Die remaining: ' + charData.hd.current + '/' + charData.hd.max
    }
  }
  var rollParams = splitParams(charData.hd.type);
  rollParams.unshift('+');
  var rollData = parseRolls(rollParams);
  Logger.log('rollData = ' + rollData);
  if (rollData === null){
    return errorHandler.invalidAmount();
  }
  charData = addHP(charData, rollData.total);
  charData = subHD(charData);
  var output = {};
  output.text = '<@' + reqData.userID + '>';
  output.text += standardRollStringBuilder(rollData);
  output.response_type = "in_channel";
  output["attachments"] = [
    {
      "title": reqData.char.name + ' used a Hit Die!',
      "text": 'Hit Die remaining: ' + charData.hd.current + '/' + charData.hd.max
    },
    {
      "title": reqData.char.name + ' healed ' + rollData.total + ' HP!',
      "text": 'Current HP: ' + charData.hp.current + '/' + charData.hp.max
    }
  ];
  return output;
}

function longRestHandler(reqData){
  if (reqData.params.length > 0){return errorHandler.invalidParameters();}
  var charData = reqData.char.charData;
  charData.hp.set(charData.hp.max);
  charData = recoverHD(charData);
  var output = {};
  output.text = '<@' + reqData.userID + '>';
  output.response_type = "in_channel";
  output["attachments"] = [
    {
      "title": reqData.char.name + ' took a long rest!'
    },  
    {
      "title": 'Hit Die increased by ' + charData.hd.restIncrease + '!', 
      "text": 'Current Hit Die: ' + charData.hd.current + '/' + charData.hd.max
    },
    {
      "title": 'HP maxed out!', 
      "text": 'Current HP: ' + charData.hp.current + '/' + charData.hp.max
    }    
  ];
  return output;
}

function statusHandler(reqData){
  var charData = reqData.char.charData;
  var load = charData.load.current;
  var str = charData.ab.str;
  var encumText = load > 15*str ? 'overencumbered!' : load > 10*str ? 'heavily encumbered!' : load > 5*str ? 'lightly encumbered!' : 'unencumbered!';
  var optionalStat = charData.op.name ? charData.op : null;
  var optionalStatText = optionalStat ? '\n*' + optionalStat.name + '*: ' + optionalStat.current + '/' + optionalStat.max : '';
  var output = {};
  output.text = '<@' + reqData.userID + '>'; 
  output["attachments"] = [
    {
      "mrkdwn_in": ["text", "pretext"],
      "title": reqData.char.name + '\'s status:',
      "text": '*HP:* ' + charData.hp.current + '/' + charData.hp.max +
      '\n*Hit Die:* ' + charData.hd.current + '/' + charData.hd.max +
      optionalStatText +
      '\n*Carrying:* ' + charData.load.current + ' lbs' +
      '\n*Status:* ' + encumText
    }
  ];
  return output;
}

function damageHandler(reqData){
  var params = reqData.params;
  var weaponType = params.getOptionalParam();
  var critIndex;
  var didCrit;
  if (didCrit = (critIndex = params.indexOf('crit')) >= 0){
    params.splice(critIndex,1);
  }
  params.unshift('+');
  var rollObj = parseRolls(params, critIndex);
  if (rollObj === null){return errorHandler.invalidParameters();}
  var critText = didCrit ? ' critical' : '';
  var weaponTypeText = weaponType ? ' with their ' + weaponType : '';
  var output = {};
  output.text = '<@' + reqData.userID + '>';
  output.text += standardRollStringBuilder(rollObj);
  output.response_type = "in_channel";
  output.attachments = [
    {
      "title": reqData.char.name + ' dealt ' + rollObj.total + critText + ' damage' + weaponTypeText + '!'
    }
  ];
  return output;
}

function weaponHandler(reqData){
  var charData = reqData.char.charData;
  var params = reqData.params;
  var critIndex;
  var didCrit;
  if (didCrit = (critIndex = params.indexOf('crit')) >= 0){
    params.splice(critIndex,1);
  }
  var weaponName = params.shift();
  var weapon = charData.weapon.get(weaponName);
  if (!weapon || weapon.name.length === 0 || weapon.damage.length === 0){return errorHandler.invalidWeapon();}
  var dmgParams = splitParams(weapon.damage);
  dmgParams.unshift('+');
  for (var i = 0; i < params.length; i++){
    dmgParams.push(params[i]);
  }
  var rollObj = parseRolls(dmgParams, critIndex);
  if (rollObj === null){return errorHandler.invalidAmount();}
  var critText = didCrit ? ' critical' : '';
  var output = {};
  output.text = '<@' + reqData.userID + '>';
  output.text += standardRollStringBuilder(rollObj);
  output.response_type = "in_channel";
  output.attachments = [
    {
      "title": reqData.char.name + ' dealt ' + rollObj.total + critText + ' damage with their ' + weapon.name + '!'
    }
  ];
  return output;
}

function spellHandler(reqData){
  var charData = reqData.char.charData;
  var params = reqData.params;
  var critIndex;
  var didCrit;
  if (didCrit = (critIndex = params.indexOf('crit')) >= 0){
    params.splice(critIndex,1);
  }
  var spellName = params.shift();
  var spell = charData.spell.get(spellName);
  if (spell.name.length === 0 || spell.damage.length === 0){return errorHandler.invalidSpell();}
  var dmgParams = splitParams(spell.damage);
  dmgParams.unshift('+');
   for (var i = 0; i < params.length; i++){
    dmgParams.push(params[i]);
  }
  var rollObj = parseRolls(dmgParams, critIndex);
  if (rollObj === null){return errorHandler.invalidAmount();}
  var critText = didCrit ? ' critical' : '';
  var output = {};
  output.text = '<@' + reqData.userID + '>';
  output.text += standardRollStringBuilder(rollObj);
  output.response_type = "in_channel";
  output.attachments = [
    {
      "title": reqData.char.name + ' dealt ' + rollObj.total + critText + ' damage with ' + spell.name + '!'
    }
  ];
  return output;
}

function checkEncumHandler(reqData){
  var charData = reqData.char.charData;
  var str = charData.ab.str;
  var load = charData.load.current;
  var encumText = load > 15*str ? 'overencumbered!' : load > 10*str ? 'heavily encumbered!' : load > 5*str ? 'lightly encumbered!' : 'unencumbered!';
  var output = {};
  output.response_type = "in_channel";
  output.text = '<@' + reqData.userID + '>' +
    '\n*STR:* ' + str +
      '\n*Carrying:* ' + load + ' lbs'
  output.attachments = [
    {
      "title": reqData.char.name + ' is ' + encumText
    }
  ];
  return output;
}

function addEncumHandler(reqData){
  if (reqData.params.length > 1 || !isNumeric(reqData.params[0])){return errorHandler.invalidParameters();}
  var charData = reqData.char.charData;
  var str = charData.ab.str;
  var amount = parseInt(reqData.params[0]);
  charData = addLoad(charData, amount);
  var load = charData.load.current;
  var encumText = load > 15*str ? 'overencumbered!' : load > 10*str ? 'heavily encumbered!' : load > 5*str ? 'lightly encumbered!' : 'unencumbered!';
  var output = {};
  output.response_type = "in_channel";
  output.text = '<@' + reqData.userID + '>';
  output.attachments = [
    {
      "mrkdwn_in": ["text", "pretext"],
      "title": reqData.char.name + ' picked up ' + amount + ' lbs!' +
      '\nCarrying: ' + load + ' lbs' +
      '\nStatus: ' + encumText
    }
  ];
  return output;
}

function subEncumHandler(reqData){
  if (reqData.params.length > 1 || !isNumeric(reqData.params[0])){return errorHandler.invalidParameters();}
  var charData = reqData.char.charData;
  var str = charData.ab.str;
  var amount = parseInt(reqData.params[0]);
  charData = subLoad(charData, amount); 
  var load = charData.load.current;
  var encumText = load > 15*str ? 'overencumbered!' : load > 10*str ? 'heavily encumbered!' : load > 5*str ? 'lightly encumbered!' : 'unencumbered!';
  var output = {};
  output.text = '<@' + reqData.userID + '>';
  output.response_type = "in_channel";
  output.attachments = [
    {
      "mrkdwn_in": ["text", "pretext"],
      "title": reqData.char.name + ' dropped ' + amount + ' lbs!' +
      '\nCarrying: ' + load + ' lbs' +
      '\nStatus: ' + encumText
    }
  ];
  return output;
}

function addPointsHandler(reqData){
  var params = reqData.params;
  if (params.length > 1 || !isNumeric(params[0])){return errorHandler.invalidParameters();}
  var amount = parseInt(params[0]);
  var charData = reqData.char.charData;
  charData = addOP(charData, amount);
  var output = {};
  output.response_type = "in_channel";
  output.text = '<@' + reqData.userID + '>';
  output.attachments = [
    {
      "title": reqData.char.name + ' recovered ' + amount + ' ' + charData.op.name,
      "text": 'Current ' + charData.op.name + ': ' + charData.op.current + '/' + charData.op.max
    }
  ];
  return output;
}

function fedoraHandler(reqData){
  if (reqData.params.length > 0){return errorHandler.invalidParameters();}
  var charData = reqData.char.charData;
  charData = addInsp(charData);
  var output = {};
  output.response_type = "in_channel";
  output.text = '<@' + reqData.userID + '>';
  output.attachments = [
    {
      "mrkdwn_in": ["text", "pretext"],
      "title": 'God Emperor Ole tipped his fedora to ' + reqData.char.name + '!',
      "text": reqData.char.name + ' gained 1 inspiration!' +
      '\n*Current Inspiration:* ' + charData.insp.current
    }
  ];
  return output;
}

function useInspirationHandler(reqData){
  if (reqData.params.length > 0){return errorHandler.invalidParameters();}
  var charData = reqData.char.charData;
  charData = subInsp(charData);
  var output = {};
  output.response_type = "in_channel";
  output.text = '<@' + reqData.userID + '>';
  output.attachments = [
    {
      "mrkdwn_in": ["text", "pretext"],
      "title": reqData.char.name + ' channeled his euphoria!',
      "text": reqData.char.name + ' used 1 inspiration!' +
      '\n*Current Inspiration:* ' + charData.insp.current
    }
  ];
  return output;
}

function subPointsHandler(reqData){
  var params = reqData.params;
  if (params.length > 1 || !isNumeric(params[0])){return errorHandler.invalidParameters();}
  var amount = parseInt(params[0]);
  var charData = reqData.char.charData;
  charData = subOP(charData, amount);
  var output = {};
  output.response_type = "in_channel";
  output.text = '<@' + reqData.userID + '>';
  output.attachments = [
    {
      "title": reqData.char.name + ' used ' + amount + ' ' + charData.op.name,
      "text": 'Current ' + charData.op.name + ': ' + charData.op.current + '/' + charData.op.max
    }
  ];
  return output;
}

function maxPointsHandler(reqData){
  if (reqData.params.length > 0){return errorHandler.invalidParameters();}
  var charData = reqData.char.charData;
  charData.op.set(charData.op.max);
  var output = {};
  output.response_type = "in_channel";
  output.text = '<@' + reqData.userID + '>';
  output.attachments = [
    {
      "title": reqData.char.name + ' maxed out ' + charData.op.name,
      "text": 'Current ' + charData.op.name + ': ' + charData.op.current + '/' + charData.op.max
    }
   ];
   return output;
}

function dndHelpHandler(){
  return {
        "attachments" : [
          {
            "mrkdwn_in": ["text", "pretext"],
            "title": 'Dnd Bot Command List:',
            "text": '' +
            '/:roll [amount]\n\n' + 
            '\n*ATTACKS*\n' + 
            '/:attack [character] [ability] (adv/dis) (:weapon/spell name)   ->   character makes attack roll\n' +
            '/:monattack [character] [attack bonus] (adv/dis) (:enemy name)   ->   NPC attacks character\n' +
            '\n*DAMAGE*\n' +
            '/:damage [character] [amount] (crit) (:damage type)   ->   character makes damage roll\n' +
            '/:hit [character] [amount] (:damage type)   ->   character takes damage\n' +
            '/:monhit [character] [amount] (crit) (:enemy name)   ->   NPC attacks character\n' + 
            '/:heal [character] [amount]   ->   character gains hp\n' +
            '/:maxhp [character]   ->   restore character to max hp\n' +
            '/:weapon [character] [melee1/melee2/ranged1/ranged2] (crit)   ->   character deals damage with weapon \n' +
            '/:spell [character] [spell1/spell2/spell3/spell4] (crit)   ->   character deals damage with spell\n' +
            '\n*CHECKS*\n' +
            '/:ability [characer] [ability] (adv/dis)   ->   character makes an ability check\n' +
            '/:skill [character] [skill] (adv/dis)   ->   character makes skill check\n' +
            '/:save [character] [ability] (adv/dis)   ->   character makes saving throw\n' +
            '/:initiative [character] (adv/dis)   ->   character rolls for initiative\n' +
            '\n*HIT DIE*\n' +
            '/:usehd [character]   ->   character uses a hit die \n' + 
            '/:longrest [character]   ->   character takes a long rest\n' +
            '\n*ENCUMBRANCE*\n' +
            '/:pickup [character] [amount]   ->   character picks up weight\n' +
            '/:drop [character] [amount]   ->   character drops weight\n' +
            '\n*OPTIONAL POINTS*\n' +
            '/:addpoints [character] [points]   ->   add points to character\'s optional stat pool\n' +
            '/:usepoints [character] [points]   ->   subtract points from character\'s optional stat pool\n' +
            '/:maxpoints [character]   ->   restore character\'s opttional stat pool to max\n'+
            '\n*INSPIRATION*\n' +
            '/:tipfedora [character]   ->   DM awards character an inspiration point\n' +
            '/:useinspiration [character]   ->   character uses an inspiration point\n' +
            "\n/:status [character]   ->   check character's status\n"              
          }
        ]
      };
}