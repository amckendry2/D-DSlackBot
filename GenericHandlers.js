function d20Handler (params){
  var charData = requestObject.getData().char.charData;
  var ability = charData.ab.getStat(makeLowerCase(params.shift()));
  if (ability === null){return null}
  var prof = params[0]==='prof' ? params.shift() : null;
  var adv = (params[0] === 'adv' || params[0] === 'dis') ? params.shift() : null;
  var mainRoll = doRollMath((adv ? 2 : 1), 20);
  if (adv){
    if (adv === 'adv'){mainRoll.total = Math.max.apply(Math, mainRoll.rollList);}
    if (adv === 'dis'){mainRoll.total = Math.min.apply(Math, mainRoll.rollList);}
  }
  var modRolls = params.length > 0 ? parseRolls(params) : null;
  if (params.length > 0 && modRolls === null){
    return null;
  }
  var totalScore = (mainRoll.total + ability.bonus + (prof ? charData.prof : 0) + (modRolls? modRolls.total : 0));
  requestObject.setAbility(ability.type, ability.bonus).setTotalScore(totalScore)
  .setRolls(mainRoll.rollList, mainRoll.total)
  if (prof){requestObject.setProf(charData.prof);}
  if (adv){requestObject.setAdv(adv)};
  if (modRolls){requestObject.setMod(modRolls.itemList, modRolls.total)}
  return requestObject.getData();
}

