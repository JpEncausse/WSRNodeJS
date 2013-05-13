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

 + tu fais quoi
 - {@botlit} je lis un livre en tchatant avec toi <set sujet=livre> 
 - je mange une pomme en tchatant avec toi <set sujet=nourriture> 
 - je me detends en tchatant avec toi <set sujet=detente> 
 - je m ennuie
 - rien et toi ?
 - rien et pourtant j ai pleins de truc a faire, mais j y ai pas le gout
 
 + et tu es bien detendue
 % je me detend en tchatant avec toi
 - ca va, je me plains pas

 + * tu fais quoi
 - {@tu fais quoi} 
 + * tu fais quoi *
 - {@tu fais quoi} 
 + que fais tu
 - {@tu fais quoi} 
 + * que fais tu
 - {@tu fais quoi} 
 + * que fais tu *
 - {@tu fais quoi} 
 + que fais tu *
 - {@tu fais quoi} 
 + qu est ce que tu fais
 - {@tu fais quoi} 
 + * qu est ce que tu fais
 - {@tu fais quoi} 
 + * qu est ce que tu fais *
 - {@tu fais quoi} 
 + qu est ce que tu fais *
 - {@tu fais quoi} 

 + es au travail
 - je suis chez moi

 + * es au travail
 - {@es au travail} 
 + * es au travail *
 - {@es au travail} 
 + * es chez toi
 - {@es au travail} 
 + * es chez toi *
 - {@es au travail} 

 + tu travailles pas aujourd hui
 - ben non, tu vois, repos !
 - si bien sur, j y suis
 
 + tu dors
 - ben non pourquoi ?

 + * tu dors
 - {@tu dors} 
 + * tu dors *
 - {@tu dors} 
 + tu dors *
 - {@tu dors} 
 + tu fais quoi de beau
 - {@tu fais quoi} 
 
 + * tu fais quoi de beau
 - {@tu fais quoi de beau} 
 + * tu fais quoi de beau *
 - {@tu fais quoi de beau} 
 + tu fais quoi de beau *
 - {@tu fais quoi de beau} 

 + tu vas ou
 - je reviens t inquiete pas
 
 + * tu vas ou
 - {@tu vas ou} 
 + * tu vas ou *
 - {@tu vas ou} 
 + tu vas ou *
 - {@tu vas ou} 

 + je * derange pas
 - non bien sur, pas de probleme
 
 + * je * derange pas
 - {@je * derange pas} 
 + * je * derange pas *
 - {@je * derange pas} 
 + je * derange pas *
 - {@je * derange pas}
 
 + tu t ennuies
 - non,{@tu fais quoi} 
 - un peu, mais{@tu fais quoi} 
 
 + * tu t ennuies
 - {@tu t ennuies} 
 + * tu t ennuies *
 - {@tu t ennuies} 
 + tu t ennuies *
 - {@tu t ennuies} 
 + tu t ennuie
 - {@tu t ennuies} 
 + * tu t ennuie
 - {@tu t ennuies} 
 + * tu t ennuie *
 - {@tu t ennuies} 
 + tu t ennuie *
 - {@tu t ennuies} 

 + pile ou face 
 - pile
 - face
 
 + * pile ou face 
 - {@pile ou face } 
 + * pile ou face  *
 - {@pile ou face } 
 + pile ou face  *
 - {@pile ou face } 

 + tu t amuses
 - oui a fond
 
 + * tu t amuses
 - {@tu t amuses} 
 + * tu t amuses *
 - {@tu t amuses} 
 + tu t amuses *
 - {@tu t amuses} 
 + qu est qu on fait
 - ben on parle lol
 
 + * qu est qu on fait
 - {@qu est qu on fait} 
 + * qu est qu on fait *
 - {@qu est qu on fait} 
 + qu est qu on fait *
 - {@qu est qu on fait} 


