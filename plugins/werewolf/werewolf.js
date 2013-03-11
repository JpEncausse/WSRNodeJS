
var mp3Dawn     = "plugins/werewolf/medias/dawn1.mp3";
var mp3Scream   = "plugins/werewolf/medias/scream.mp3";
var mp3Howl     = "plugins/werewolf/medias/howl1.mp3";
var mp3Night    = "plugins/werewolf/medias/night.mp3";
var mp3Cocorico = "plugins/werewolf/medias/cocorico.mp3";
var mp3Crowd    = "plugins/werewolf/medias/crowd.mp3";

var kill        = '';
var next        = 'night';
var WereWolf    = {};

/*
var WereWolf    = {
  state : 'register',
  Players : {
    'Dark' : { 'name' : 'Dark', 'breed' : 'werewolf', 'mayer' : false, 'alive' : true },
    'Leia' : { 'name' : 'Leia', 'breed' : 'human',    'mayer' : false, 'alive' : true },
    'Yoda' : { 'name' : 'Yoda', 'breed' : 'human',    'mayer' : true,  'alive' : true }
  }
};
*/

// ------------------------------------------
//  UTILITY FUNCTION
// ------------------------------------------

var checkMayer  = function(){
  for(player in  WereWolf.Players){ 
    if (WereWolf.Players[player].mayer && WereWolf.Players[player].alive) return;
  }
  
  next = WereWolf.state;
  WereWolf.state = 'mayer';
}

var countWereWolf = function(){
  var count = 0;
  for(player in  WereWolf.Players){ 
    if (WereWolf.Players[player].breed == 'werewolf') count++;
  }
  return count;
}

var getMayer = function(){
  var count = 0;
  for(player in  WereWolf.Players){ 
    if (WereWolf.Players[player].mayer) return player;
  }
  return "à élire";
}

var isWinner = function(SARAH){
  var werewolf = 0;
  var human    = 0;
  
  for(player in  WereWolf.Players){ 
    var p = WereWolf.Players[player];
    if (!p.alive){ continue; };
    if (p.breed == 'werewolf'){ werewolf++; } else { human++; }
  }

  if (werewolf > 0 && human > 0){ return false }
  
  SARAH.remote({ 'pause': mp3Dawn  });
  SARAH.remote({ 'pause': mp3Night });
  SARAH.remote({ 'pause': mp3Crowd });
  
  console.log('werewolf: ' + werewolf + ' human: ' + human);
  
  if (werewolf == 0){ SARAH.remote({ 'tts' : 'Tous les loup garou sont mort ! Le village est sauvé !' });   }
  if (human == 0){    SARAH.remote({ 'tts' : 'Tous les villageois sont mort ! Le village est détruit !' }); }
  
  return true;
}

// ------------------------------------------
//  AUTOMATE FUNCTION
// ------------------------------------------

var automate = function(data, callback, conf, SARAH){
   
  // Configuration
  config = conf.modules.werewolf;
  
  console.log(data, WereWolf);
  // ------------------------------------------
  //  1. INIT THE GAME
  // ------------------------------------------
  
  if (data.init){
    WereWolf.state = 'register';
    WereWolf.Players = {};
    callback({'tts' : "Avec plaisir ! Mélangez et distribuez les rôles. Ensuite chaque joueur me montre sa carte."});
    return;
  }
  
  // ------------------------------------------
  //  0. HANDLE QUERIES
  // ------------------------------------------
  
  if (!WereWolf.Players){
    return;
  }
  
  if (data.query == 'werewolf'){
    callback({'tts' : "Il reste " + countWereWolf() + " loup garou en jeu"});
    return;
  }
  
  if (data.query == 'mayer'){
    callback({'tts' : "Le maire du village est " + getMayer() + "."});
    return;
  }
  
  if (!WereWolf.state){
    callback({'tts' : "Aucune partie n'a été crée."});
    return;
  }
  
  // ------------------------------------------
  //  2. REGISTER PLAYERS
  // ------------------------------------------
  
  if (data.player && WereWolf.state == 'register'){
    WereWolf.Players[data.player] = {
      'name'  : data.player, // The player name
      'breed' : data.breed,  // The player type: peasant or werewolf
      'alive' : true,        // Dead or Alive
      'mayer' : false
    }
    callback({'tts' : "Le joueur " + data.player + " est enregistré."});
    return;
  }
  
  // ------------------------------------------
  //  3. START THE GAME
  // ------------------------------------------

  if (data.start && WereWolf.state == 'register'){
    SARAH.play(mp3Dawn);
    callback({'tts' : "Bienvenue dans le village de Thiercelieux !"});
    
    // Kill a first villager handy man for SARAH
    var villagers = [];
    for (player in  WereWolf.Players){
      if (WereWolf.Players[player].breed != 'werewolf') 
        villagers.push(player);
    }
    var mj = villagers[Math.floor(Math.random() * villagers.length)];
    WereWolf.Players[mj].alive = false;
    
    setTimeout(function(){
      SARAH.remote({
        'play' : mp3Scream,
        'tts'  : "Un crime vient d'être commis ! Le maire du village, " + mj + " vient d'être assassiné !"
      });
    },5000);
    
    WereWolf.state = 'mayer';
    setTimeout(function(){ automate({}, false, conf, SARAH); }, 15000);
    return;
  }
  
  // ------------------------------------------
  //  REGISTER MAYER
  // ------------------------------------------
  
  if (data.player && WereWolf.state == 'vote'){
    var player = WereWolf.Players[data.player];
    if (!player){ callback({'tts' : "Joueur inconnu"});  return; }
    if (!player.alive){ callback({'tts' : "Le joueur est déjà mort"});  return; }
    player.mayer = true;
    callback({'pause': mp3Crowd, 'tts' : "Félicitation le maire " + player.name + " a été élu !"}); // FIXME
    
    WereWolf.state = next;
    setTimeout(function(){ automate({}, false, conf, SARAH);  },5000);
    return;
  }
  
  // ------------------------------------------
  //  REGISTER WEREWOLF KILL
  // ------------------------------------------
  
  if (data.player && WereWolf.state == 'werewolf'){ 
    var player = WereWolf.Players[data.player];
    if (!player){ callback({'tts' : "Joueur inconnu"}); return; }
    if (!player.alive){ callback({'tts' : "Le joueur est déjà mort"});  return; }
    
    kill = player.name;
    player.alive = false;
    callback({'tts' : "Les loups garous ont désigné leur victime. Ils peuvent fermer les yeux."});
    
    WereWolf.state = 'day'; 
    setTimeout(function(){ automate({}, false, conf, SARAH);  },5000);
    return;
  }
  
  // ------------------------------------------
  //  REGISTER PEASANT KILL
  // ------------------------------------------
  
  if (data.player && WereWolf.state == 'peasant'){
    var player = WereWolf.Players[data.player];
    if (!player){ callback({'tts' : "Joueur inconnu"}); return; }
    if (!player.alive){ callback({'tts' : "Le joueur est déjà mort"});  return; }
    
    player.alive = false;
    var tts  = "Les villageois ont linché " + player.name + ". ";
        tts += (player.breed == 'werewolf' ? "Victoire ! un loup garou est mort !" : "C'était un villageois innocent !");
    callback({ 'pause' : mp3Crowd, 'tts' :  tts});  // FIXME
    
    
    WereWolf.state = 'night'
    setTimeout(function(){
      if (isWinner(SARAH)){ return; }
      checkMayer();
      automate({}, false, conf, SARAH);  
    }, 8000);
    return;
  }
  
  // ------------------------------------------
  //  MAYER STEP
  // ------------------------------------------
  
  if (WereWolf.state == 'mayer'){
    SARAH.speak("Vous devez voter pour un nouveau Maire et me l'indiquer.");
    WereWolf.state = 'vote';
    return;
  }
  
  // ------------------------------------------
  //  NIGHT STEP
  // ------------------------------------------

  if (WereWolf.state == 'night'){
  
    SARAH.script('/sarah/eedomus?periphId=12350&periphValue=0');
    SARAH.remote({ 'pause': mp3Dawn, 'play' : mp3Night });
    SARAH.speak("La nuit tombe sur le village. Tous les joueurs vivants doivent fermer les yeux.");
    
    setTimeout(function(){
      SARAH.remote({
        'play' : mp3Howl,
        'tts'  : "Les loups garou ouvrent les yeux et doivent désigner en silence une victime. . Un joueur déjà éliminé doit me présenter la carte de la prochaine victime."
      });
    }, 5000);
    
    WereWolf.state = 'werewolf';
    return;
  }
  
  // ------------------------------------------
  //  DAY STEP
  // ------------------------------------------

  if (WereWolf.state == 'day'){
  
    SARAH.script('/sarah/eedomus?periphId=12350&periphValue=100');
    SARAH.remote({ 'pause': mp3Night, 'play' : mp3Dawn });
    
    setTimeout(function(){
      SARAH.remote({ 'play' : mp3Cocorico, 'tts': "Le jour se lève. Tous les joueurs peuvent ouvrir les yeux." });
    }, 3000);
    
    setTimeout(function(){
      SARAH.remote({ 'play' : mp3Scream, 'tts'  : "Le cadavre de " + kill + " a été découvert sur la place du village ! ." });
    }, 13000);
    
    setTimeout(function(){
      if (isWinner(SARAH)){ return; }
      SARAH.play(mp3Crowd);
      SARAH.speak("Les loups garou sont parmis vous ! Les villageois demande justice ! Indiquez-moi le joueur condamné.");
    }, 20000);
    
    WereWolf.state = 'peasant';
    return;
  }
}
exports.action = automate;
