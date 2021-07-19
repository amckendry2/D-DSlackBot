function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function makeLowerCase(string) {
  return string.toLowerCase();
}

function makeUpperCase(string){
  return string.toUpperCase();
}

function splitParams(param){
  return String(param).match(/[+-]|\:.*|\w+/g);
}

Array.prototype.getOptionalParam = function() {
  if (this[this.length-1][0] === ':'){
    return this.pop().substr(1);
  }else{
    return '';
  }
};

function getSign(int){
  var sign = int > 0 ? 1 : int < 0 ? -1 : 0; 
  switch (sign){
    case -1:
      return '';
      break;
    case 0:
      return '';
      break;
    case 1:
      return '+';
      break;
    default:
      return null;
  }
}



function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function checkIfArrayIsUnique(arr) {
    var map = {}, i, size;

    for (i = 0, size = arr.length; i < size; i++){
        if (map[arr[i]]){
            return false;
        }

        map[arr[i]] = true;
    }

    return true;
}
