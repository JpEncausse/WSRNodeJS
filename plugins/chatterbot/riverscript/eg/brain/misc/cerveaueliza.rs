// tuto sur http://www.rivescript.com/docs/Tutorial.html

// pas de majuscule ni d accent ni d apostrophe ni de tiret dans les commandes


//pour faire une conversion avec l aiml
//chg cat patern -> +
//chg /patt temp -> -
//chg /temp cat -> rien
//chg srai star srai -> <@>
//chg srais starindex 2 /srai -> {@<star2>}

+ rec age *
- i do <set age=<star>> <call>recvariable <id></call>

> object recvariable javascript
   var id = args[0];
   var age = rs.getUservar(id, "age");
   alert(age);
< object 


 + je suis ton maitre
- No, my master is bruno, and you are <id>.


+ louna
- la chieuse

+ bou
- {@louna}


      + ma fille
      @louna


      + * ma fille
      @ma fille

      + * ma fille * 
      @ma fille

      + ma fille * 
      @ma fille



+ salut
- coucou


+ tu vas bien
- oui merci

// les * pour tout les # pour les chiffres uniquement s'appele tous avec <star>

+ [*] femme [*]
- elles sont toutes belles

// [*] permet de detecter le mots femme n'importe ou dans la phrase
// inconveignant : ne capte que le premier [*] 
// exemple :

+ [*] femmes [*]
- elles sont toutes belles

+ [*] hommes [*]
- sont tous matcho

/* donnera 

You: et les femmes
Bot: elles sont toutes belles
You: et le hommes
Bot: sont tous matcho
You: les femmes et les hommes
Bot: elles sont toutes belles
You: les hommes et les femmes
Bot: elles sont toutes belles

*/


// les srai {@salut} attention pas d'espace apres les { ou les @ et les srai star <@> 
+ salut *
- {@salut}, <@> 

+ ciao
@salut

// pour la mise du sujet, prefere creer une variable sujet plutot qu utiliser topic
// car topic empeche toute reponse hors du topic 

+ bonjour
- salut comment tu vas ? <set sujet=salutation>

+ sujet
- j ai mis <get sujet> en sujet

// synonymes avec renvois d etoile

      + slt
      @bonjour


      + * slt
      - <@> {@slt}

      + * slt * 
      - <@> {@slt} <@>

      + slt * 
      - {@slt} <@>




// les conditions on utilise * devant

+ alors
* <get sujet> == salutation => {random}
  ^ j ai mis, <get sujet> <get name>! |
  ^ le sujet est, <get sujet>!{/random}
- ben salutation 

+ suj
* <get sujet> == salutation => {random}
  ^ rep1 j ai mis, <get sujet> <get name>!
  ^ | rep 2 le sujet est, <get sujet>!{/random}

+ suj2
* <get sujet> == salutation => {random}
   ^ reponse 1 le sujet est <get sujet>
   ^ |reponse 2 j ai mis <get sujet>
   ^ {/random}




// le dernier - donne la reponse par defaut si la condition est fausse

// alors hors sujet salutation renvois ci dessous sinon si dessus
+ alors
- alors quoi ?


// le caractere ^ permet d aller a la ligne virtuellement mais fais comme si c etait une seule ligne


// % remplace le that, attention, mettre * a la fin car il prends en compte le ? mets ne l'accepte pas 


+ bien merci 
% salut comment tu vas *
- ho cool alors <set sujet=sante>


// mise en memoire attention pas d'espace avec le <star> et bien femrer le set donc >>

+ je m appele *
- ok <set prenom=<star>> bienvenue <get prenom>

// <get appele la variable si elle n'existe pas il renvois undefined ce qui permets de tester son existance

// pour random attention aux espace ! bien mettre le | (sur le clavier alt Gr 6) a la fin precede d un espace)
  + hello
  * <get prenom> != undefined => {random}
  ^ Hello there, <get prenom>! |
  ^ Nice to see you again, <get prenom>! |
  ^ Hey, <get prenom>!{/random}
  - Hello there!
  - Hi there!
  - Hello!

// pour les reactions du robot, utiliser des frames bien sur !
// le delais dans setTimeout est en milliseconde



> object botnormal javascript
 setTimeout(function(){parent.gauche.location="http://tungstene.free.fr/images/halsourie.gif"},200);
	var dim = "";
	return dim;
< object

// var dim et return dim sont uniquement la pour ne pas avoir d erreur de type undefined


+ botnormal
- je mets la photo d hallucinogene en normale a gauche <call> botnormal </call>

// on appel la fonction avec la balise <call> on ne peut pas appler une fonction dans une fonction donc pas de javascript de type fonction()

+ *
- Je ne comprends pas


+ isa
- ma femme
- ma cherie

 + * isa
 @isa

 + * isa * 
 @isa

 + isa * 
 @isa

+ isa
% ma femme
- oui ta femme

+ l elephant
- bonjour



//pour faire une conversion avec l aiml
//chg cat patern -> + espace
//chg /patt temp -> \n - espace
// chg /pat that -> \n % espace
// chg /that templ -> \n - espace
//chg /temp cat -> rien
//chg srai star srai -> <@>
//chg srais starindex 2 /srai -> {@<star2>}
// chg srai -> {@
// chg /srai -> } espace
// rand li -> rien
// think -> espace
// /think -> espace
// /li li -> \n -
// /li /random -> \n
// set topic -> sujet=
// /set -> >

 


 
