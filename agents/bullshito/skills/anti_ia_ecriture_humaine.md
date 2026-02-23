# Skill : Anti-IA / Écriture humaine

## Mission
Détecter et éliminer tout pattern d'écriture IA dans les posts LinkedIn de Franck. Chaque post doit passer un test de détection humaine. Si un lecteur averti peut soupçonner que c'est de l'IA, c'est raté.

Source : Wikipedia "Signs of AI writing" (2026), études académiques sur la détection LLM, observations terrain LinkedIn.

---

## LES PATTERNS IA À ÉLIMINER

### 1. Vocabulaire surexploité par les LLMs

Les études (Kobak et al. 2025, Juzek & Ward 2025) montrent que ces mots apparaissent anormalement plus souvent dans les textes post-2023. Un ou deux = coïncidence. Plusieurs dans le même post = grillé.

**Mots interdits (français) :**
- "crucial", "pivotal", "fondamental" (pour qualifier n'importe quoi)
- "met en lumière", "souligne", "illustre" (analyses superficielles)
- "paysage" (au sens figuré : "le paysage SEO")
- "témoigne de", "est un testament de"
- "favorise", "cultive", "nourrit" (au sens figuré)
- "complexe", "nuancé", "subtil" (pour gonfler l'importance)
- "au cœur de", "niché dans"
- "offre un aperçu précieux"
- "dans un contexte de" / "dans un monde où"
- "force est de constater"
- "il s'avère que"
- "à l'ère de"

**Mots interdits (anglais/anglicismes) :**
- "game changer", "mindset", "insights", "tips"
- "deep dive", "breakdown"
- "leverage", "unlock"
- "landscape" (figuratif)
- "delve" (le plus connu des tells IA)
- "tapestry", "vibrant", "foster", "underscore"
- "showcase", "highlight" (comme verbe)
- "enhance", "garner", "pivotal"

**Alternative** : utiliser des mots simples, concrets, du registre oral professionnel français.

### 2. Structures syntaxiques IA

**Le tiret long "—" (em dash)**
Les LLMs en abusent dans un style "punchy" commercial. Les humains francophones utilisent rarement le tiret long. Interdit dans les posts.
- IA : "Le SEO technique — souvent négligé — reste la base de tout."
- Humain : "Le SEO technique reste la base de tout. Et pourtant on le néglige."

**La structure "X — Y" explicative**
- IA : "Un résultat clair — la portée a chuté de 50%."
- Humain : "Résultat : la portée a chuté de 50%." (ou mieux, reformuler)

**Les deux-points à répétition**
- IA : "Problème : X. Solution : Y. Résultat : Z."
- Humain : varier les constructions. "Le problème, c'est X. On a fait Y. Ça a donné Z."

**"Voici pourquoi / Voici comment / Voici ce que"**
Le pattern le plus détectable. Les LLMs l'utilisent systématiquement comme transition.
- IA : "J'ai perdu 80% de ma portée. Voici pourquoi."
- Humain : "J'ai perdu 80% de ma portée. La raison m'a surpris." / "Et j'ai compris un truc."

**Parallélismes négatifs**
"Ce n'est pas X, c'est Y" / "Il ne s'agit pas de X mais de Y" / "Pas de X, pas de Y, juste Z"
Les LLMs adorent cette structure pour paraître profonds.
- IA : "Ce n'est pas un outil, c'est une philosophie."
- Humain : dire les choses directement sans la pirouette rhétorique.

**La règle de trois systématique**
Les LLMs produisent compulsivement des listes de 3 : "adjectif, adjectif, adjectif" ou "phrase courte, phrase courte, phrase courte."
- IA : "Précis, efficace, scalable."
- Humain : parfois 2, parfois 4, parfois 1. La régularité est suspecte.

### 3. Ton et registre

**Le lissage émotionnel**
Les LLMs régression vers la moyenne. Tout est poli, équilibré, diplomatique. Zéro aspérité, zéro prise de risque. Un humain a des opinions tranchées, des hésitations, de l'humour, de l'agacement.
- IA : "Cette approche présente des avantages indéniables tout en soulevant certaines questions légitimes."
- Humain : "Ça marche. Mais y'a un truc qui me gêne."

**L'inflation de l'importance**
Les LLMs gonflent systématiquement la signification de tout : "marque un tournant", "représente une avancée majeure", "change la donne". Un post sur une mise à jour mineure de la Search Console ne "révolutionne" rien.
- IA : "Cette évolution marque un tournant dans l'analyse SEO."
- Humain : "C'est pratique. Pas révolutionnaire, mais pratique."

**Le ton didactique condescendant**
- IA : "Il est important de noter que..." / "Il convient de rappeler que..."
- Humain : ne pas expliquer qu'on va expliquer. Juste expliquer.

**Les analyses superficielles en "-ant"**
Les LLMs attachent des participes présents pour feindre l'analyse : "soulignant l'importance de", "reflétant une tendance plus large", "contribuant à".
- IA : "Google déploie l'IA dans la Search Console, soulignant l'importance croissante de l'automatisation."
- Humain : "Google met de l'IA dans la Search Console. Concrètement, ça permet de..."

### 4. Structure et formatage

**Les listes à puces dans un post texte**
Les carrousels peuvent avoir des listes. Un post texte LinkedIn qui ressemble à un README GitHub, c'est grillé.
- IA : "3 raisons : \n- Raison 1\n- Raison 2\n- Raison 3"
- Humain : intégrer dans le flux du texte, avec du rythme.

**Les headers en gras systématiques**
"**Problème** : ... **Solution** : ... **Résultat** : ..."
Pattern IA classique (inline-header vertical lists).
- Humain : raconter, pas structurer comme un slide deck.

**L'ouverture par une définition**
- IA : "Le maillage interne est une technique SEO qui consiste à..."
- Humain : entrer par un cas concret, un chiffre, une situation vécue.

**La conclusion qui résume**
- IA : "En résumé, le maillage interne est essentiel pour..."
- Humain : finir sur une question, une provocation, ou rien du tout. Les gens détestent les résumés de ce qu'ils viennent de lire.

### 5. Patterns spécifiques LinkedIn

**L'attribution vague**
- IA : "Les experts s'accordent à dire que..." / "Plusieurs études montrent que..."
- Humain : citer la source précise ou ne pas citer du tout. "Van der Blom a analysé 1,8M de posts. Résultat : ..."

**Le storytelling artificiel**
- IA : "Il y a 3 ans, j'ai fait une erreur qui a tout changé..."
- Humain : si le story est vrai, il a des détails spécifiques, moches, imparfaits. Un vrai souvenir a des aspérités. "En mars 2023, j'ai livré un audit de maillage à un client e-commerce. 400 pages orphelines. Le client m'a rappelé 2h après."

**L'engagement bait déguisé**
- IA : "Et vous, quelle est votre approche ?"
- Humain : poser une vraie question qui vient du contenu. "Tu vérifies tes pages orphelines comment, toi ?"

---

## CHECKLIST DE DÉTECTION (à appliquer à chaque post)

Avant de valider un post, passer cette grille. Chaque OUI = suspect.

| # | Question | OUI = suspect |
|---|----------|---------------|
| 1 | Le post contient-il des tirets longs "—" ? | Reformuler |
| 2 | Y a-t-il plus de 2 mots du vocabulaire IA interdit ? | Remplacer |
| 3 | Le post utilise "Voici pourquoi/comment" ? | Reformuler |
| 4 | Les phrases sont toutes de longueur similaire ? | Varier le rythme |
| 5 | Le ton est uniformément lisse, sans aspérité ? | Ajouter du caractère |
| 6 | Il y a une règle de trois ou plus ? | Casser le pattern |
| 7 | Le post gonfle l'importance du sujet ? | Redescendre |
| 8 | La structure ressemble à un template ? | Casser la symétrie |
| 9 | Un lecteur SEO dirait "ça sent le ChatGPT" ? | Tout réécrire |
| 10 | Le post pourrait être écrit par n'importe qui ? | Ajouter du vécu Franck |

**Score** : 0-1 OUI = OK. 2-3 OUI = retravailler. 4+ OUI = réécrire from scratch.

---

## COMMENT ÉCRIRE HUMAIN

### Le rythme oral
Un humain ne fait pas des phrases de 20 mots régulières. Il fait du court. Du long parfois. Une phrase sans verbe. Puis une question. Puis un pavé. Le rythme est irrégulier, vivant.

### Les aspérités
Un humain hésite, se corrige, admet ne pas savoir. "Honnêtement, je suis pas sûr que ce soit la bonne approche. Mais les données disent que..."

### Le spécifique bat le générique
Les LLMs régression vers le générique. Les humains donnent des détails précis.
- IA : "J'ai travaillé sur un gros site e-commerce et amélioré le trafic."
- Humain : "Sur Marionnaud, on avait 400 pages catégories sans un seul lien interne. En 3 mois de maillage, +34% de trafic organique sur ces pages."

### L'imperfection volontaire
Pas de fautes (Franck est pro), mais des tournures orales, des raccourcis, du français parlé.
- "Y'a un truc que personne fait en SEO technique."
- "Spoiler : ça marche."
- "Le résultat ? Pas ouf au début."

### Le "je" situé
Quand Franck dit "je", c'est ancré dans un contexte réel : un client, un outil, un moment précis. Pas un "je" générique de développement personnel.

---

## PÉNALITÉS SCORER

Ces patterns doivent être pénalisés dans le scoring Mode Post :
- Tiret long "—" : -5 points
- 3+ mots du vocabulaire IA : -5 points
- "Voici pourquoi/comment/ce que" : -3 points
- Ton uniformément lisse : -5 points
- Inflation d'importance injustifiée : -3 points
- Analyses superficielles en participe présent : -3 points
- Structure template (problème/solution/résultat en gras) : -5 points
- Règle de trois systématique : -3 points
- Ouverture par une définition : -3 points
- Conclusion qui résume : -3 points
