var statBonusParser = function(stat){
  return Math.floor((stat-10)/2);
}

var skillBonusParser = function(skill){
  var ability;
  switch (skill){
    case 'athletics':
      ability = 'str'
      break;
    case 'acrobatics':
    case 'sleight':
    case 'stealth': 
      ability = 'dex'
      break;
    case 'arcana':
    case 'history':
    case 'investigation':
    case 'nature':
    case 'religion': 
      ability = 'int';
      break;
    case 'animal':
    case 'insight':
    case 'medicine':
    case 'perception':
    case 'survival': 
      ability = 'wis';
      break;
    case 'deception':
    case 'intimidation':
    case 'performance':
    case 'persuasion': 
      ability = 'cha';
      break;
    default:
      return null;
      break;
  }
  return ability;
}


var sheetHelper = (function(){
  var sheets;
  var charSheet;
  var charData = {};
  return{
    getSheets: function(){
      sheets = SpreadsheetApp.openById('1xCFCBRaLYaWG2LISFPvMIOtQmNlcUvk1CD8Zu5xOlk0');
      return this;
    },
    getCharData: function(charName){
      var locations = dataLocations.getLocations();
      charSheet = sheets.getSheetByName(charName);
      if (charSheet === null){
        return null;
      }
      var hp = {};
      hp.currentCell = charSheet.getRange(locations.hpCC[0], locations.hpCC[1]);
      hp.current = hp.currentCell.getValue();
      hp.maxCell = charSheet.getRange(locations.hpMC[0], locations.hpMC[1]);
      hp.max = hp.maxCell.getValue();
      hp.set = function(val){
        hp.currentCell.setValue(val);
        hp.current = val;
      }
      var hd = {};
      hd.typeCell = charSheet.getRange(locations.hdTC[0],locations.hdTC[1]);
      hd.type = hd.typeCell.getValue();
      hd.currentCell = charSheet.getRange(locations.hdCC[0], locations.hdCC[1]);
      hd.current = hd.currentCell.getValue();
      hd.maxCell = charSheet.getRange(locations.hdMC[0], locations.hdMC[1]);
      hd.max = hd.maxCell.getValue();
      hd.restIncrease = hd.max > 1 ? Math.floor(hd.max / 2) : 1;
      hd.set = function(val){
        hd.currentCell.setValue(val);
        hd.current = val;
      }
      var ab = {};
      ab.str = charSheet.getRange(locations.str[0], locations.str[1]).getValue();
      ab.dex = charSheet.getRange(locations.dex[0], locations.dex[1]).getValue();
      ab.con = charSheet.getRange(locations.con[0], locations.con[1]).getValue();
      ab.int = charSheet.getRange(locations.int[0], locations.int[1]).getValue();
      ab.wis = charSheet.getRange(locations.wis[0], locations.wis[1]).getValue();
      ab.cha = charSheet.getRange(locations.cha[0], locations.cha[1]).getValue();
                                  
      ab.getStat = function(stat){
        switch (stat){
          case 'str':
          case 'strength':
            return {
              type: 'STR',
              bonus: statBonusParser(ab.str)
            }
            break;
          case 'dex':
          case 'dexterity':
            return {
              type: 'DEX',
              bonus: statBonusParser(ab.dex)
            }
            break;
          case 'con':
          case 'constitution':
            return {
              type: 'CON',
              bonus: statBonusParser(ab.con)
            }
            break;
          case 'int':
          case 'intelligence':
            return {
              type: 'INT',
              bonus: statBonusParser(ab.int)
            }
            break;
          case 'wis':
          case 'wisdom':
            return {
              type: 'WIS',
              bonus: statBonusParser(ab.wis)
            }
            break;
          case 'cha':
          case 'charisma':
            return {
              type: 'CHA',
              bonus: statBonusParser(ab.cha)
            }
          default:
            return null;
            
        }
      }
      var skill = {};
      skill.acrobatics = charSheet.getRange(locations.acrobatics[0], locations.acrobatics[1]).getValue();
      skill.animal = charSheet.getRange(locations.animal[0], locations.animal[1]).getValue();
      skill.arcana = charSheet.getRange(locations.arcana[0], locations.arcana[1]).getValue();
      skill.athletics = charSheet.getRange(locations.athletics[0], locations.athletics[1]).getValue();
      skill.deception = charSheet.getRange(locations.deception[0], locations.deception[1]).getValue();
      skill.history = charSheet.getRange(locations.history[0], locations.history[1]).getValue();
      skill.insight = charSheet.getRange(locations.insight[0], locations.insight[1]).getValue();
      skill.intimidation = charSheet.getRange(locations.intimidation[0], locations.intimidation[1]).getValue();
      skill.investigation = charSheet.getRange(locations.investigation[0], locations.investigation[1]).getValue();
      skill.medicine = charSheet.getRange(locations.medicine[0], locations.medicine[1]).getValue();
      skill.nature = charSheet.getRange(locations.nature[0], locations.nature[1]).getValue();
      skill.perception = charSheet.getRange(locations.perception[0], locations.perception[1]).getValue();
      skill.performance = charSheet.getRange(locations.performance[0], locations.performance[1]).getValue();
      skill.persuasion = charSheet.getRange(locations.persuasion[0], locations.persuasion[1]).getValue();
      skill.religion = charSheet.getRange(locations.religion[0], locations.religion[1]).getValue();
      skill.sleight = charSheet.getRange(locations.sleight[0], locations.sleight[1]).getValue();
      skill.stealth = charSheet.getRange(locations.stealth[0], locations.stealth[1]).getValue();
      skill.survival = charSheet.getRange(locations.survival[0], locations.survival[1]).getValue();
      skill.strSave = charSheet.getRange(locations.strSave[0], locations.strSave[1]).getValue();
      skill.dexSave = charSheet.getRange(locations.dexSave[0], locations.dexSave[1]).getValue();
      skill.conSave = charSheet.getRange(locations.conSave[0], locations.conSave[1]).getValue();
      skill.intSave = charSheet.getRange(locations.intSave[0], locations.intSave[1]).getValue();
      skill.wisSave = charSheet.getRange(locations.wisSave[0], locations.wisSave[1]).getValue();
      skill.chaSave = charSheet.getRange(locations.chaSave[0], locations.chaSave[1]).getValue(); 
      skill.getSkill = function(_skill){
        switch (_skill){
          case 'acrobatics':
            return skill.acrobatics;
            break;
          case 'animal':
            return skill.animal;
            break;
          case 'arcana':
            return skill.arcana;
            break;
          case 'athletics':
            return skill.athletics;
            break;
          case 'deception':
            return skill.deception;
            break;
          case 'history':
            return skill.history;
            break;
          case 'insight':
            return skill.insight;
            break;
          case 'intimidation':
            return skill.intimidation;
            break;
          case 'investigation':
            return skill.investigation;
            break;
          case 'medicine':
            return skill.medicine;
            break;
          case 'nature':
            return skill.nature;
            break;
          case 'perception':
            return skill.perception;
            break;
          case 'performance':
            return skill.performance;
            break;
          case 'persuasion':
            return skill.persuasion;
            break;
          case 'religion':
            return skill.religion;
            break;
          case 'sleight':
            return skill.sleight;
            break;
          case 'stealth':
            return skill.stealth;
            break;
          case 'survival':
            return skill.survival;
            break; 
          case 'strSave':
            return skill.strSave;
            break;
          case 'dexSave':
            return skill.dexSave;
            break;
          case 'conSave':
            return skill.conSave;
            break;
          case 'intSave':
            return skill.intSave;
            break;
          case 'wisSave':
            return skill.wisSave;
            break;
          case 'chaSave':
            return skill.chaSave;
            break;
          default:
            return null;
            break;
        }
      }
      skill.getSave = function(_save){
        switch (_save){
            case 'str':
            return skill.strSave;
            break;
          case 'dex':
            return skill.dexSave;
            break;
          case 'con':
            return skill.conSave;
            break;
          case 'int':
            return skill.intSave;
            break;
          case 'wis':
            return skill.wisSave;
            break;
          case 'cha':
            return skill.chaSave;
            break;
          default:
            return null;
            break;
        }
      }
      var weapon = {};
      weapon.melee1 = charSheet.getRange(locations.melee1[0],locations.melee1[1]).getValue();
      weapon.melee1Name = charSheet.getRange(locations.melee1Name[0],locations.melee1Name[1]).getValue();
      weapon.melee2 = charSheet.getRange(locations.melee2[0],locations.melee2[1]).getValue();
      weapon.melee2Name = charSheet.getRange(locations.melee2Name[0],locations.melee2Name[1]).getValue();
      weapon.ranged1 = charSheet.getRange(locations.ranged1[0],locations.ranged1[1]).getValue();
      weapon.ranged1Name = charSheet.getRange(locations.ranged1Name[0],locations.ranged1Name[1]).getValue();
      weapon.ranged2 = charSheet.getRange(locations.ranged2[0],locations.ranged2[1]).getValue();
      weapon.ranged2Name = charSheet.getRange(locations.ranged2Name[0],locations.ranged2Name[1]).getValue();
      weapon.get = function(_weapon){
        switch(_weapon){
          case 'melee1':
            return {
              damage: weapon.melee1,
              name: weapon.melee1Name
            }
            break;
          case 'melee2':
            return {
              damage: weapon.melee2,
              name: weapon.melee2Name
            }
            break;
          case 'ranged1':
            return {
              damage: weapon.ranged1,
              name: weapon.ranged1Name
            }
            break;
          case 'ranged2':
            return {
              damage: weapon.ranged2,
              name: weapon.ranged2Name
            }
            break;  
          default:
            return null;
            break;
        }
      }
      var spell = {};
      spell.spell1 = charSheet.getRange(locations.spell1[0],locations.spell1[1]).getValue();
      spell.spell1Name = charSheet.getRange(locations.spell1Name[0],locations.spell1Name[1]).getValue();
      spell.spell2 = charSheet.getRange(locations.spell2[0],locations.spell2[1]).getValue();
      spell.spell2Name = charSheet.getRange(locations.spell2Name[0],locations.spell2Name[1]).getValue();
      spell.spell3 = charSheet.getRange(locations.spell3[0],locations.spell3[1]).getValue();
      spell.spell3Name = charSheet.getRange(locations.spell3Name[0],locations.spell3Name[1]).getValue();
      spell.spell4 = charSheet.getRange(locations.spell4[0],locations.spell4[1]).getValue();
      spell.spell4Name = charSheet.getRange(locations.spell4Name[0],locations.spell4Name[1]).getValue();
      spell.get = function(_spell){
        switch(_spell){
          case 'spell1':
            return {
              damage: spell.spell1,
              name: spell.spell1Name
            }
            break;
          case 'spell2':
            return {
              damage: spell.spell2,
              name: spell.spell2Name
            }
            break;
          case 'spell3':
            return {
              damage: spell.spell3,
              name: spell.spell3Name
            }
            break;
          case 'spell4':
            return {
              damage: spell.spell4,
              name: spell.spell4Name
            }
            break;  
          default:
            return null;
            break;
        }
      }
      var op = {}
      op.nameCell = charSheet.getRange(locations.opNC[0], locations.opNC[1]);
      op.name = op.nameCell.getValue();
      op.currentCell = charSheet.getRange(locations.opCC[0], locations.opCC[1]);
      op.current = op.currentCell.getValue();
      op.maxCell = charSheet.getRange(locations.opMC[0],locations.opMC[1]);
      op.max = op.maxCell.getValue();
      op.set = function(val){
        op.currentCell.setValue(val);
        op.current = val;
      };
      var load = {};
      load.currentCell = charSheet.getRange(locations.load[0], locations.load[1]);
      load.current = load.currentCell.getValue();
      load.set = function(val){
        load.currentCell.setValue(val);
        load.current = val;
      }
      var insp = {};
      insp.currentCell = charSheet.getRange(locations.insp[0],locations.insp[1]);
      insp.current = insp.currentCell.getValue();
      insp.set = function(val){
        insp.currentCell.setValue(val);
        insp.current = val;
      }
      charData.weapon = weapon;
      charData.spell = spell;
      charData.skill = skill;
      charData.prof = charSheet.getRange(locations.prof[0], locations.prof[1]).getValue();
      charData.ab = ab;
      charData.hp = hp;
      charData.hd = hd;
      charData.op = op;
      charData.load = load;
      charData.insp = insp;
      charData.ac = charSheet.getRange(locations.ac[0], locations.ac[1]).getValue();
      charData.charName = charName;
      return charData;
    }
  };
})();

var dataLocations = (function(){
  var data={
    hpCC:[1,2],
    hpMC:[2,2],
    hdTC:[15,2],
    hdCC:[16,2],
    hdMC:[17,2],
    str:[38,2],
    dex:[39,2],
    con:[40,2],
    int:[41,2],
    wis:[42,2],
    cha:[43,2],
    acrobatics:[54,2],
    animal:[55,2],
    arcana:[56,2],
    athletics:[57,2],
    deception:[58,2],
    history:[59,2],
    insight:[60,2],
    intimidation:[61,2],
    investigation:[62,2],
    medicine:[63,2],
    nature:[64,2],
    perception:[65,2],
    performance:[66,2],
    persuasion:[67,2],
    religion:[68,2],
    sleight:[69,2],
    stealth:[70,2],
    survival:[71,2],
    strSave:[46,2],
    dexSave:[47,2],
    conSave:[48,2],
    intSave:[49,2],
    wisSave:[50,2],
    chaSave:[51,2],
    prof:[12,2],
    melee1Name:[19,2],
    melee1:[20,2],
    melee2Name:[23,2],
    melee2:[24,2],
    ranged1Name:[27,2],
    ranged1:[28,2],
    ranged2Name:[31,2],
    ranged2:[32,2],
    spell1Name:[77,2],
    spell1:[78,2],
    spell2Name:[81,2],
    spell2:[82,2],
    spell3Name:[85,2],
    spell3:[86,2],
    spell4Name:[89,2],
    spell4:[90,2],
    ac:[35,2],
    load:[6,2],
    opNC:[74,1],
    opCC:[74,2],
    opMC:[75,2],
    insp:[92,2]
  }
  return {
    getLocations:function(){
      return data;
    }
  }
})();

