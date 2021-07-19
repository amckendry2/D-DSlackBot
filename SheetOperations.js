function subHP(charData, amount){
  var newVal = amount > charData.hp.current ? 0 : charData.hp.current - amount;
  charData.hp.set(newVal);
  return charData;
}

function addHP(charData, amount){
  var newVal = amount + charData.hp.current;
  newVal = newVal > charData.hp.max ? charData.hp.max : newVal;
  charData.hp.set(newVal);
  return charData;
}

function addOP(charData, amount){
  var newVal = amount + charData.op.current;
  newVal = newVal > charData.op.max ? charData.op.max : newVal;
  charData.op.set(newVal);
  return charData;
}

function subOP(charData, amount){
  var newVal = amount > charData.op.current ? 0 : charData.op.current - amount;
  charData.op.set(newVal);
  return charData;
}

function addLoad(charData, amount){
  var newVal = amount + charData.load.current;
  newVal = newVal > charData.load.max ? charData.load.max : newVal;
  charData.load.set(newVal);
  return charData;
}

function subLoad(charData, amount){
  var newVal = amount > charData.load.current ? 0 : charData.load.current - amount;
  charData.load.set(newVal);
  return charData;
}

function addInsp(charData){
  var newVal = charData.insp.current + 1;
  charData.insp.set(newVal);
  return charData;
}

function subInsp(charData){
  var newVal = 1 > charData.insp.current ? 0 : charData.insp.current - 1;
  charData.insp.set(newVal);
  return charData;
}

function recoverHD(charData){
  var newVal = charData.hd.current + charData.hd.restIncrease;
  newVal = newVal > charData.hd.max ? charData.hd.max : newVal;
  charData.hd.set(newVal);
  return charData;
}

function subHD(charData){
  var newVal = charData.hd.current - 1;
  newVal = newVal >= 0 ? newVal : 0;
  charData.hd.set(newVal);
  return charData;
}
