function doRollMath(leftNum, rightNum){
  var rollList = [];
  var total = 0;
  var returnObj = {};
  for (var i = 0; i < leftNum; i++){
    randomGen.randomize()
    var roll = Math.floor(randomGen.get()*rightNum) + 1;
    rollList.push(roll);
    total += roll;
  } 
  returnObj.rollList = rollList;
  returnObj.total = total;
  return returnObj;
} 

var randomGen = (function(){
  var _randomNum;
  return {
    randomize: function(){
      _randomNum = Math.random();
    },
    get: function(){
      return _randomNum;
    }
  };
})();

function parseRolls(params, _critIndex){
  var critIndex = _critIndex || 0;
  var rollRegex = /^(\d+)[d](\d+)$/m;
  var opRegex = /^[+-]$/gm;
  var rollObj = 
      {
        rolled: false,
        itemList: [],
        total: 0,
      };
  for (var i = 0; i < params.length; i+=2){
    var doCrit = (i < critIndex);
    var item = params[i];
    var nextItem = params[i+1];
    var roll, leftNum, rightNum;
    var thisObj = {};
    if (!item.match(opRegex)){
      return null;
    }
    if (isNumeric(nextItem)){
      thisObj.type = 'integer';
      thisObj.value = item === '+' ? parseInt(nextItem): parseInt(nextItem) * -1;
      
    }else if(roll = nextItem.match(rollRegex)){
      leftNum = doCrit ? parseInt(roll[1]) * 2 : parseInt(roll[1]);
      rightNum = roll[2];
      var rolled = doRollMath(leftNum, rightNum);
      thisObj.type = 'roll';
      thisObj.rollInput = roll[0];
      thisObj.crit = doCrit;
      thisObj.value = item === '+' ? rolled.total : rolled.total * -1;
      thisObj.rollList = rolled.rollList;
      rollObj.rolled = true;
    }else{
      return null;
    }
    rollObj.itemList.push(thisObj);
    rollObj.total += thisObj.value;
  }
  return rollObj;
}