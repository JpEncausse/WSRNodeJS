+ *
- tu dis <star>

+ depart age
- tu as quel age ? <set sujet=age> <set verifage=1>


+ tu as quel age 
* <get verifage> == 1 => j ai <bot age> ans <set sujet= age> 
- j ai <bot age> ans et toi tu as quel age ? <set sujet= age> <set verifage=1>

      + * tu as quel age
      @tu as quel age

      + * tu as quel age * 
      @tu as quel age

      + tu as quel age * 
      @tu as quel age


+ #
% * tu as quel age*
- <set age=<star>> {@repage}
+ * #
% * tu as quel age*
- <set age=<star2>> {@repage}

+ * # *
% * tu as quel age*
- <set age=<star2>> {@repage}

+ # *
% * tu as quel age*
- <set age=<star>> {@repage}

+ repage
- ha ok, tu es un {@categorieage}

+ *
% * tu as quel age*
* <get pbage> == 1 => heu t as vraiment un soucis la ! alors tu as quel age ? <set pbage=2>
* <get pbage> == 2 => bon ben c est pas grave si tu veux pas me le dire, je m en moque !
- Bon, je vois que t as des soucis pour entrer les chiffres alors dis moi tu as quel age ? <set pbage=1>

+ categorieage
* <get age> >= 18 => <set categorieage=adulte> adulte
* <get age> < 15 => <set categorieage=enfant> enfant
* <get age> >= 15 => <set categorieage=ado> ado


+ quel categorie
- <get categorieage>


   + ton age
   @tu as quel age
      + * ton age
      @ton age
      + * ton age * 
      @ton age
      + ton age * 
      @ton age











