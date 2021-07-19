function testPost() {
 var request = {
   parameters: {
     command: "/:save",
     text: "gnim con",
     user_id: '[user id]'
   }
 };
 doPost(request);
}

function doPost(request){
 var output = {};
 if (String(request.parameters.command) === '/:roll'){
   output = rollHandler((request.parameters));
   Logger.log(output);
   return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
 }
 if (String(request.parameters.command) === '/:dndhelp'){
   output = dndHelpHandler((request.parameters));
   return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
 }
 var params = request.parameters;
 var errorOutput = initHandler(request.parameters);
 if (errorOutput){return ContentService.createTextOutput(JSON.stringify(errorOutput)).setMimeType(ContentService.MimeType.JSON);}
 var reqData = requestObject.getData();
 switch(makeLowerCase(String(params.command))){
   case '/:attack':
     output = attackHandler(reqData);
     break;
   case '/:skill':
     output = skillCheckHandler(reqData);
     break;
   case '/:ability':
     output = abilityCheckHandler(reqData);
     break;
   case '/:save':
     output = saveThrowHandler(reqData);
     break;
   case '/:hit':
     output = hitHandler(reqData);
     break;
   case '/:heal':
     output = healHandler(reqData);
     break;
   case '/:maxhp':
     output = maxHPHandler(reqData);
     break;
   case '/:usehd':
     output = useHDHandler(reqData);
     break;
   case '/:longrest':
     output = longRestHandler(reqData);
     break;
   case '/:status':
     output = statusHandler(reqData);
     return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
     break;
   case '/:damage':
     output = damageHandler(reqData);
     break;
   case '/:weapon':
     output = weaponHandler(reqData);
     break;
   case '/:spell':
     output = spellHandler(reqData);
     break;
   case '/:dndhelp':
     output = dndHelpHandler(reqData);
     return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
     break;
   case '/:monattack':
     output = monAttackHandler(reqData);
     break;
   case '/:monhit':
     output = monHitHandler(reqData);
     break;
   case '/:checkencum':
     output = checkEncumHandler(reqData);
     return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
     break;
   case '/:pickup':
     output = addEncumHandler(reqData);
     break;
   case '/:drop':
     output = subEncumHandler(reqData);
     break;
   case '/:addpoints':
     output = addPointsHandler(reqData);
     break;
   case '/:usepoints':
     output = subPointsHandler(reqData);
     break;
   case '/:maxpoints':
     output = maxPointsHandler(reqData);
     break;
   case '/:initiative':
     output = initiativeHandler(reqData);
     break;
   case '/:tipfedora':
     output = fedoraHandler(reqData);
     break;
   case '/:useinspiration':
     output = useInspirationHandler(reqData);
     break;
   default:
     output = {"text": "Invalid command"};
 }
 Logger.log(output);
 return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);;
}

function initHandler(_params) {
 requestObject.setUserID(_params.user_id);
 var params = splitParams(String(_params.text));
 var charName = capitalizeFirstLetter(makeLowerCase(params.shift()));
 var charData = sheetHelper.getSheets().getCharData(charName);
 requestObject.setChar(charName, charData); 
 if (charData === null){
   return errorHandler.invalidCharName();
 }
 requestObject.setParams(params);
 return;  
}