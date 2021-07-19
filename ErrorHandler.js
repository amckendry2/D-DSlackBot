var errorHandler = {
  invalidParameters: function(){
    var output = {"response_type": "ephemeral",
                  "text": "Invalid parameters. Type /:dndhelp for help with commands."};
    return output;
  },
  invalidCharName: function(){
    var output = {"response_type": "ephemeral",
                  "text": "Invalid character name."};
    return output;
  },
  invalidAmount: function(){
    var output = {"response_type": "ephemeral",
                  "text": "Invalid [amount] parameter."};
    return output;
  },
  invalidWeapon: function(){
    var output = {"response_type": "ephemeral",
                  "text": "No weapon in slot!"}
    return output;
  },
  invalidSpell: function(){
    var output = {"response_type": "ephemeral",
                  "text": "No spell in slot!"};
    return output;
  },
  missingParameters: function(){
    var output = {"response_type": "ephemeral",
                  "text": "Missing parameters. Type /:dndhelp for help with commands."};
    return output;
  }
}

