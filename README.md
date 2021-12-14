# DnDSlackBot
Prototype Google Sheets API for running D&amp;D games via Slack

The bot is accessed using slash commands in a Slack chat. The bot reads and updates Google Sheets containing various character stats, simulates dice rolls, and returns a message containing the results of the requested action. I created this for a text-based D&D campaign being played by some friends.
<pre>
*COMMAND TEMPLATE*: {slash command} [required params] (optional params) ("literal optional param") (:optional end param)

*BASIC ROLL* 
/:roll           [amount]     

*ATTACKS*    
/:attack         [character] [ability]      ("adv"/"dis") (:weapon/spell name) ->   character makes attack roll    
/:monattack      [character] [attack bonus] ("adv"/"dis") (:enemy name)        ->   NPC attacks character    

*DAMAGE*   
/:damage         [character] [amount] ("crit") (:damage type)                  ->   character makes damage roll    
/:hit            [character] [amount]          (:damage type)                  ->   character takes damage    
/:monhit         [character] [amount] ("crit") (:enemy name)                   ->   NPC attacks character     
/:heal           [character] [amount]                                          ->   character gains hp    
/:maxhp          [character]                                                   ->   restore character to max hp    
/:weapon         [character] [melee1/melee2/ranged1/ranged2] ("crit")          ->   character deals damage with weapon     
/:spell          [character] [spell1/spell2/spell3/spell4]   ("crit")          ->   character deals damage with spell    

*CHECKS*   
/:ability        [character] [ability] ("adv"/"dis")                           ->   character makes an ability check    
/:skill          [character] [skill]   ("adv"/"dis")                           ->   character makes skill check    
/:save           [character] [ability] ("adv"/"dis")                           ->   character makes saving throw    
/:initiative     [character]           ("adv"/"dis")                           ->   character rolls for initiative    

*HIT DIE*   
/:usehd          [character]                                                   ->   character uses a hit die      
/:longrest       [character]                                                   ->   character takes a long rest    

*ENCUMBRANCE*   
/:pickup         [character] [amount]                                          ->   character picks up weight    
/:drop           [character] [amount]                                          ->   character drops weight    

*OPTIONAL POINTS*   
/:addpoints      [character] [points]                                          ->   add points to character\ s optional stat pool    
/:usepoints      [character] [points]                                          ->   subtract points from character\ s optional stat pool    
/:maxpoints      [character]                                                   ->   restore character\ s opttional stat pool to max   

*INSPIRATION*   
/:tipfedora      [character]                                                   ->   DM awards character an inspiration point    
/:useinspiration [character]                                                   ->   character uses an inspiration point    
/:status         [character]                                                   ->   check character s status\n"   

</pre>

Images of actual usage:

![alt text](https://i.ibb.co/2NNLV8W/image0-2.png)
![alt text](https://i.ibb.co/9G8rz40/image0-3.png)
![alt text](https://i.ibb.co/z27NhZ4/image1-2.png)

