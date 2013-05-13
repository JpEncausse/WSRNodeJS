/*
	RiveScript 2 Test Suite - Conçu pour démontrer toute l'
	fonctionnalité que 2 RiveScript est censée soutenir.
*/

/************************************************* *****************************
 * "Begin.rs" Command Test *
 ************************************************** ****************************/

> begin
	+ request
	- {ok}
< begin

+ test comment // inline comment
- It worked? // Inline deux

// Variables Bot
! var nom = Bot test RiveScript
! âge var = 9000
! var = genre androgyne
! var = emplacement cyberespace
! var = téléphone 555-1234
! var email = test@mydomain.com

// Remplacements
! sub +         = plus
! sub -         = minus
! sub /         = divided
! sub *         = times
! sub i'm       = i am
! sub i'd       = i would
! sub i've      = i have
! sub i'll      = i will
! sub don't     = do not
! sub isn't     = is not
! sub you'd     = you would
! sub you're    = you are
! sub you've    = you have
! sub you'll    = you will
! sub he'd      = he would
! sub he's      = he is
! sub he'll     = he will
! sub she'd     = she would
! sub she's     = she is
! sub she'll    = she will
! sub they'd    = they would
! sub they're   = they are
! sub they've   = they have
! sub they'll   = they will
! sub we'd      = we would
! sub we're     = we are
! sub we've     = we have
! sub we'll     = we will
! sub whats     = what is
! sub what's    = what is
! sub what're   = what are
! sub what've   = what have
! sub what'll   = what will
! sub can't     = can not
! sub whos      = who is
! sub who's     = who is
! sub who'd     = who would
! sub who'll    = who will
! sub don't     = do not
! sub didn't    = did not
! sub it's      = it is
! sub could've  = could have
! sub couldn't  = could not
! sub should've = should have
! sub shouldn't = should not
! sub would've  = would have
! sub wouldn't  = would not
! sub when's    = when is
! sub when're   = when are
! sub when'd    = when did
! sub y         = why
! sub u         = you
! sub ur        = your
! sub r         = are
! sub im        = i am
! sub wat       = what
! sub wats      = what is
! sub ohh       = oh
! sub becuse    = because
! sub becasue   = because
! sub becuase   = because
! sub practise  = practice
! sub its a     = it is a
! sub fav       = favorite
! sub fave      = favorite
! sub iam       = i am
! sub realy     = really
! sub iamusing  = i am using
! sub amleaving = am leaving
! sub yuo       = you
! sub youre     = you are
! sub didnt     = did not
! sub ain't     = is not
! sub aint      = is not
! sub wanna     = want to
! sub brb       = be right back
! sub bbl       = be back later
! sub gtg       = got to go
! sub g2g       = got to go

// Personne substitutions
! person i am    = you are
! person you are = I am
! person i'm     = you're
! person you're  = I'm
! person my      = your
! person your    = my
! person you     = I
! person i       = you

// Les tableaux
! array colors = red green blue cyan yellow magenta white orange brown black
  ^ gray grey fuchsia maroon burgundy lime navy aqua gold silver copper bronze
  ^ light red|light green|light blue|light cyan|light yellow|light magenta
! array be     = is are was were

/************************************************* *****************************
 * Test de déclenchement de base
 ************************************************** ****************************/

/* Répondre atomique
   ------------
   L'homme dit: bonjour bot
   Réponse attendue: Bonjour humaine.
*/
+ Bonjour bot
- Bonjour humaine.

/* Répondre atomique
   ------------
   L'homme dit: quel est votre nom
   Réponse attendue: Vous pouvez m'appeler Bot test RiveScript.
*/
+ Quel est votre nom
- Vous pouvez m'appeler <bot name>.

/* Caractères génériques
   ---------
   L'homme dit: mon truc préféré dans le monde est la programmation
   Réponse attendue: Pourquoi aimez-vous tant la programmation?
*/
+ Mon truc préféré dans le monde est *
- Pourquoi aimez-vous tant <star>?

/* Caractères génériques
   ---------
   L'homme dit: John m'a dit de dire bonjour
   Réponse attendue: Pourquoi avez-vous dit john dire bonjour?
*/
+ * M'a dit de dire *
- Pourquoi avez-vous dit <star1>-à-dire <star2>?

/* Caractères génériques
   ---------
   L'homme dit: Je pense que le ciel est orange.
   Réponse attendue: Pensez-vous que le ciel est orange beaucoup?
*/
+ I think *
- Pensez-vous que <star> beaucoup?

/* Caractères génériques
   ---------
   L'homme dit: Je suis âgé de vingt ans
   Réponse attendue: Dis-moi que comme un nombre au lieu d'énoncés comme «vingt»
   Remarques supplémentaires: Lorsque plusieurs déclencheurs existent qui sont identiques, sauf pour
                   leur caractère générique, l'ordre des priorités que sont
                   _ Est toujours le premier, est # deuxième et dernier *. Donc, dans ce code
                   et la suivante, le "i am # ans" doit correspondre à
                   Si le joker est un nombre et le "i am ans *" devrait
                   seulement correspondre autrement.
*/
+ I am ans *
- Dis-moi que comme un nombre au lieu d'énoncés comme «<star>".

/* Caractères génériques
   ---------
   L'homme dit: Je suis 20 ans
   Réponse attendue: Je vais vous rappeler que vous avez 20 ans.
   Remarques supplémentaires: Cette réplique doit également définir la variable "âge" à 20 pour cet utilisateur.
*/
+ I am # ans
- <= Âge déterminé <star>> Je me souviendrai que vous sont à des années <star> ancienne.

/* Alternances
   ------------
   L'homme dit: Quel est votre numéro de téléphone à la maison?
   Réponse attendue: Vous pouvez m'appeler sur mon numéro à la maison, 555-1234.
   L'homme dit: Quel est votre numéro de téléphone au bureau?
   Réponse attendue: Vous pouvez m'appeler sur mon numéro de bureau, 555-1234.
   L'homme dit: Quel est votre numéro de téléphone au travail?
   Réponse attendue: Vous pouvez m'appeler sur mon numéro professionnel, 555-1234.
   L'homme dit: Quel est votre numéro de téléphone cellulaire?
   Réponse attendue: Vous pouvez m'appeler à mon numéro de cellulaire, 555-1234.
*/
+ Quelle est votre (maison | bureau | travail | cellule) numéro de téléphone
- Vous pouvez m'appeler à mon numéro de <star>, <bot téléphone>.

/* Alternances
   ------------
   L'homme dit: Vous êtes d'accord?
                   Vous allez bien?
                   Tu vas bien?
                   Vous allez bien?
   Réponse attendue: Je vais bien, merci de demander.
*/
+ (Êtes-vous | toi) (ok | bien)
- Je vais bien, merci de demander.

/* Optionals
   ---------
   L'homme dit: Comment puis-je vous contacter?
                   Puis-je vous contacter?
   Réponse attendue: Vous pouvez avoir mon numéro de téléphone: 555-1234.
*/
+ [Comment] puis-je vous contacter
- Vous pouvez avoir mon numéro de téléphone: téléphone> <bot.

/* Optionals
   ---------
   L'homme dit: Avez-vous une adresse électronique?
                   Vous avez une adresse e-mail?
                   Avez-vous un e-mail?
                   Vous avez un e-mail?
                   Avez-vous des e-mail?
                   Vous avez courriel?
   Réponse attendue: Vous pouvez m'envoyer un e-mail à test@mydomain.com.
*/
+ [Ne] vous avez [une] [email address]
- Vous pouvez m'envoyer un courriel à courriel> <bot.

/* Optionals
   ---------
   L'homme dit: Dites-moi votre numéro de téléphone
                   Dites-moi votre numéro de
                   Dites-moi votre numéro de téléphone à la maison
                   Dites-moi votre numéro à la maison
                   Dites-moi votre numéro de téléphone au bureau
                   Dites-moi votre numéro de bureau
                   Dites-moi votre numéro de téléphone professionnel
                   Dites-moi votre numéro de téléphone professionnel
                   Dites-moi votre numéro de téléphone cellulaire
                   Dites-moi votre numéro de cellulaire
   Réponse attendue: Mon numéro de téléphone est le 555-1234.
*/
+ Dis-moi ton [accueil | bureau | travail | cellule] [téléphone] nombre
- Mon numéro de téléphone est <bot téléphone>.

/* Tableaux
   ------
   L'homme dit: De quelle couleur est ma chemise bleue?
   Réponse attendue: Votre chemise est bleue, idiot.
   L'homme dit: De quelle couleur est ma chemise rouge?
   Réponse attendue: Votre chemise est rouge clair, idiot.
   L'homme dit: De quelle couleur est ma chemise noire?
   Réponse attendue: Votre chemise est noire, idiot.
*/
+ De quelle couleur sont mes couleurs (@) chemise
- Votre chemise est <star>, idiot.

/* Tableaux
   ------
   L'homme dit: De quelle couleur était cheval blanc de George Washington?
   Réponse attendue: George Washingtons cheval était blanc.
*/
+ De quelle couleur était * (@ couleurs) *
- <formal> <star3> Était <star2>.

/* Tableaux
   ------
   L'homme dit: J'ai une voiture de sport jaune
   Réponse attendue: Pourquoi avez-vous choisi cette couleur pour une voiture de sport?
*/
+ J'ai un coloris @ *
- Pourquoi avez-vous choisi cette couleur pour un <star>?

/* Priorité déclencheurs
   -----------------
   L'homme dit: j'ai un canapé noir
   Réponse attendue: C'est un mot qui n'est pas utilisé beaucoup plus.
   Notes supplémentaires: Cela devrait normalement correspondre à la gâchette ci-dessus, mais celui-ci a
                   une haute priorité et pertinents en premier, même si le déclencheur
                   ci-dessus a plus de mots et un match de plus spécifique.
*/
+ {100} = poids * davenport
- C'est un mot qui n'est pas utilisé beaucoup plus.

/************************************************* *****************************
 * Test de base Répondre
 ************************************************** ****************************/

/* Réponse atomique
   ---------------
   L'homme dit: comment vas-tu
   Réponse attendue: Je vais bien.
*/
+ Comment allez-vous
- Je vais bien.

/* Réponse aléatoire
   ---------------
   L'homme dit: bonjour
                   salut
                   hé
   Réponse attendue: Hey there!
                   Bonjour!
                   Salut!
*/
+ (Bonjour | salut | hey)
- Hé là!
- Bonjour!
- Salut!

/* Réponse aléatoire
   ---------------
   L'homme dit: mon nom est Casey
   Réponse attendue: Ravi de vous rencontrer, Casey.
                   Salut, Casey, mon nom est RiveScript Bot test.
                   Casey, ravi de vous rencontrer.
   Notes supplémentaires: Cela permettrait également de définir le nom de var = Casey pour l'utilisateur.
*/
+ Mon nom est *
- <= Nom de l'ensemble <formal>> Nice to meet you, <formal>.
- <= Nom de l'ensemble <formal>> Salut, <formal>, mon nom est <nom <bot.
- <= Nom de l'ensemble <formal>> <formal>, nice to meet you.

/* Réponse Weighted Random
   ------------------------
   L'homme dit: Dis-moi un secret
   Réponse attendue: Je ne vais pas vous dire un secret.
                   Vous ne pouvez pas gérer un secret.
                   Bon, ici c'est un secret ... nope, je plaisante.
                   En fait, je n'ai pas de secrets.
*/
+ Me dire un secret
- Je ne vais pas vous dire un secret {20} = poids.
- Vous ne pouvez pas gérer un secret {20} = poids.
- Bon, ici c'est un secret ... nope, je plaisante. {5} = poids
- En fait, je n'ai pas de secrets.

/************************************************* *****************************
 Test de commande *
 ************************************************** ****************************/

/*% Précédent
   ---------
   L'homme dit: Toc, toc.
   Réponse attendue: Qui est là?
   L'homme dit: Banana.
   Réponse attendue: Banane qui?
   L'homme dit: Toc, toc.
   Réponse attendue: Qui est là?
   L'homme dit: Banana.
   Réponse attendue: Banane qui?
   L'homme dit: Toc, toc.
   Réponse attendue: Qui est là?
   L'homme dit: Orange.
   Réponse attendue: Orange qui?
   L'homme dit: Orange vous heureux que je n'ai pas dit que la banane?
   Réponse attendue: Haha! «Orange vous heureux que je n'ai pas dit que la banane"! : D
*/
+ Knock Knock
- Qui est là?

+ *
% Qui est là
- <Blague set = <star>> <SENTENCE> qui?

+ <get Joke> *
- Haha! "{} <get Phrase joke> <star> {/} phrase"! : D

/* ^ Continuer
   ---------
   L'homme dit: Dis-moi un poème
   Réponse attendue: Little Miss Muffit assis sur son tuffet
                     dans une sorte de nonchalance façon.
                     Avec son marges proglaciaires autour d'elle,
                     l'araignée, la bounder,
                     N'est-ce pas dans l'image aujourd'hui.
*/
+ Dis-moi un poème
- Little Miss Muffit assis sur son tuffet \ n
^ Dans une sorte de nonchalance façon. \ N
^ Avec son champ de force autour d'elle, \ n
^ L'araignée, la bounder, \ n
^ N'est-ce pas dans l'image aujourd'hui.

/* @ Redirect
   ---------
   L'homme dit: Qui êtes-vous?
   Réponse attendue: Vous pouvez m'appeler Bot test RiveScript.
*/
+ Qui êtes-vous
@ Quel est votre nom

/* @ Redirect
   ---------
   L'homme dit: récursion test
   Réponse attendue: ERR: récursivité profonde détecté!
*/
Récursion test +
@ Tester plus récursion

+ Tester plus récursion
Récursion test @

/* Conditionnelles
   ------------
   L'homme dit: Que suis-je assez vieux pour faire?
   Réponse attendue: Tu ne m'as jamais dit comment vous êtes vieux.
                   Tu es trop jeune pour faire quoi que ce soit.
                   Vous êtes plus de 18 ans afin que vous puissiez jouer.
                   Vous êtes plus de 21, de sorte que vous pouvez boire.
*/
+ What am i assez vieux pour faire
* <get Age> == undefined => Tu ne m'as jamais dit comment vous êtes vieux.
* <get Age>> = 21 => Vous êtes plus de 21 ans de sorte que vous pouvez boire.
* <get Age>> = 18 => Vous êtes plus de 18 ans afin que vous puissiez jouer.
* <get Age> <18 => Tu es trop jeune pour faire quoi que ce soit.
- Cette réponse ne devrait pas arriver.

/* Conditionnelles
   ------------
   L'homme dit: Suis-je 18 ans?
   Réponse attendue: Je ne sais pas quel âge vous êtes.
                   Vous n'êtes pas 18, no.
                   Oui, vous l'êtes.
*/
+ I am 18 ans
* <get Age> == undefined => Je ne sais pas quel âge vous êtes.
* <get Age>! = 18 => Tu n'es pas 18, no.
- Oui, vous l'êtes.

/* Conditionnelles
   ------------
   L'homme dit: Count.
   Réponse attendue: Commençons par 1.
   L'homme dit: Count.
   Réponse attendue: j'ai ajouté 1 au comte.
   L'homme dit: Count.
   Réponse attendue: J'ai ajouté 5 maintenant.
   L'homme dit: Count.
   Réponse attendue: Soustrait 2.
   L'homme dit: Count.
   Réponse attendue: Maintenant que j'ai doublé.
   L'homme dit: Count.
   Réponse attendue: Soustrait 2 de cela maintenant.
   L'homme dit: Count.
   Réponse attendue: Divisé que par 2.
   L'homme dit: Count.
   Réponse attendue: Soustrait 1.
   L'homme dit: Count.
   Réponse attendue: Maintenant, j'ai ajouté 3.
   L'homme dit: Count.
   Réponse attendue: Ajout de nouveau sur 3.
   L'homme dit: Count.
   Réponse attendue: Nous en avons terminé. Savez-vous quel numéro je me suis arrêté?
   L'homme dit: 9
   Réponse attendue: Vous avez raison, je me suis arrêté au numéro 9. :)
*/
+ Count
* <get <nombre == Undefined => <ensemble count=1> nous allons commencer avec 1.
* <get <nombre == 0 => <ensemble count=1> on recommence à 1.
* <get <nombre == 1 => <add count=1> j'ai ajouté 1 au comte.
* <get <nombre == 2 => <add count=5> J'ai ajouté 5 maintenant.
* <get <nombre == 3 => <add count=3> Maintenant, j'ai ajouté 3.
* <get <nombre == 4 => <sous-objet> count=1> Soustrait 1.
* <get <nombre == 5 => <mult count=2> Maintenant que j'ai doublé.
* <get <nombre == 6 => <add count=3> Ajouté 3 fois.
* <get <nombre == 7 => <sous-objet> count=2> Soustrait 2.
* <get <nombre == 8 => <div count=2> que divisé par 2.
* <get <nombre == 9 => <ensemble count=0> Nous en avons terminé. Savez-vous ce que je certain nombre
  ^ \ Sstopped à?
* <get <nombre == 10 => <sous-objet> count=2> Soustrait 2 de cela maintenant.

+ (9 | nine)
*% Savez-vous quel numéro je me suis arrêté à
- Tu as raison, je me suis arrêté au numéro 9. :)

/************************************************* *****************************
 * Macro Objet Testing (Perl seulement) *
 ************************************************** ****************************/

/ Objet Encoding *
   ---------------
   L'homme dit: Encode quelque chose en MD5.
   Réponse attendue: «quelque chose» en MD5 est: 437b930db84b8079c2dd804a71936b5f
   L'homme dit: Encode quelque chose en Base64.
   Réponse attendue: «quelque chose» en Base64 est: c29tZXRoaW5n
*/

> Objet encoder perl
	my ($ rs, la méthode $, @ args) = @ _;
	my $ msg = join ("", @ args);

	utiliser Digest :: MD5 qw (md5_hex);
	utiliser MIME :: Base64 qw (encode_base64);

	if ($ method eq "md5") {
		retourner md5_hex ($ msg);
	}
	else {
		retourner encode_base64 ($ msg);
	}
<Objet

+ * Encoder en md5
- "<star>" En MD5 est: <indicatif> encoder <star> md5 </ appel>

+ * Encoder en base64
- "<star>" En Base64 est: <indicatif> encoder en base64 <star> </ appel>

> Qu'objet de test de javascript
	var w = screen.width;
	var h = screen.height;
	var dim = w + "x" + h;
	dim revenir;
<Objet

+ Test javascript
- Essais javascript ... <indicatif> test </ appel>.

! thèmes globaux = bonjour tout le monde

+ Test global
- Essais réservés mondiale: sujets = <env topics>; users = <env users>; <env client = Client>; réservé = <env reserved>.

/************************************************* *****************************
 * Test du sujet
 ************************************************** ****************************/

/*
    Temporairement en ignorant les utilisateurs abusifs
    ----------------------------------
    L'homme dit: insert juron ici
    Réponse attendue: Omg vous dire! Je ne parle pas de vous jusqu'à ce que vous excuser.
    L'homme dit: (rien)
    Réponse attendue: Pas avant que tu m'en excuse.
                    Dites que vous êtes désolé.
                    Désolé d'être si méchant.
    L'homme dit: sorry
    Réponse attendue: D'accord, je vous pardonne.
*/

Insert + gros mot ici
- Omg vous dire! Je ne parle pas de vous jusqu'à ce que vous excuser. {Sujet} = excuses

Excuses thème>
	+ *
	- Pas avant que tu t'excuses.
	- Dites que vous êtes désolé.
	- Apologize pour être si méchant.

	+ [*] (Désolé | excuses) [*]
	-. Okay, je vais te pardonner {random} topic =
Sujet <

/*
    Sujet héritage (simple jeu de rôle)
    -------------------------------------------
    L'homme dit: entrer dans le donjon
    Réponse attendue: (vous plonge dans un jeu de mini-écrémé le code ci-dessous pour comprendre.
                    it out)
*/

+ Entrer dans le donjon
- {} Topic = room1 Vous avez entré le donjon. {@} Regard

Sujet> global
	+ Help {100} = poids
	Aide de jeu (à faire) -

	+ Inventaire {100} = poids
	- Votre inventaire (à faire)

	+ (Nord | n | sud | s | est | e | Ouest | w)
	- Vous ne pouvez pas aller dans cette direction.

	+ Quittez {100} = poids
	- {Random} topic = Quitter!

	+ _ *
	- Vous n'avez pas besoin d'utiliser le mot «<star>" dans ce match.

	+ *
	- Je ne comprends pas ce que vous dites. Essayez le "help" ou "quitter".
Sujet <

Donjon thème> hérite mondiale
	+ Indice
	- Qu'est-ce que vous avez besoin d'un conseil sur \ n?
	^ * Comment jouer \ n
	^ * A propos de ce jeu

	+ Comment jouer
	% Qu'avez-vous besoin d'un soupçon *
	- Les commandes sont «aide», «inventaire» et «quitter». Il suffit de lire et taper.

	+ À propos de ce jeu
	% Qu'avez-vous besoin d'un soupçon *
	- C'est juste un jeu RPG échantillon de démontrer héritage sujet.
Sujet <

Sujet> room1 hérite donjon
	+ Regarder
	- Vous êtes dans une chambre avec un grand nombre «1» sur le sol \ s.
	^ Les sorties sont au nord et à l'est.

	+ (Nord | n) {5} = poids
	- {Topic = CH2} {@} regard

	+ (Est | e) {5} = poids
	- {Topic = CH3} {@} regard
Sujet <

Sujet> room2 hérite donjon
	+ Regarder
	- Cette chambre dispose le chiffre "2" ici. Il s'agit d'un flacon qui est coincé ici
	^ \ Pécher une sorte de mécanisme qui s'ouvre uniquement lorsque le bouton est maintenu
	^ \ Sdown (oui, maintenez enfoncé le bouton puis saisir rapidement le ballon). \ N \ n
	^ La seule sortie est vers le sud.

	+ [Push | presse | HOLD] [*]
	- Vous appuyez sur le bouton et le mécanisme de maintien du flacon est \ s
	^ Déverrouillé.

	+ [Prendre | pick up] [vous] flacon [*]
	Mécanisme de% * en maintenant le flacon est déverrouillé
	- Vous essayez de prendre ballon mais ne parviennent pas vous (vous ne pouvez pas vous flacon, abandonner).

	+ [Prendre | pick up] [vous] flacon [*]
	- Vous ne pouvez pas vous flacon tandis que le mécanisme tient sur elle.

	+ (Sud | s) {5} = poids
	- Topic = {} {room1 look @}
Sujet <

Sujet> room3 hérite donjon
	+ Regarder
	- Il n'y a rien ici, mais le chiffre "3". Seule la sortie est à l'ouest.

	+ (Ouest | w) {5} = poids
	- Topic = {} {room1 look @}
Sujet <
