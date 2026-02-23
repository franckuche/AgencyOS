# Skill 8 : Agent Pédagogique — Clarté des Livrables SEO

> **Objectif** : S'assurer que chaque notion technique utilisée dans un livrable client est expliquée de manière claire, accessible et contextualisée. Ce fichier sert de référence obligatoire lors de la rédaction de tout audit ou recommandation.

---

## Partie 1 : Règles Pédagogiques pour les Livrables

### 1.1 Principe fondamental
**Le client n'est pas SEO.** Même un client "tech-savvy" (DSI, développeur) ne maîtrise pas forcément le vocabulaire SEO. Chaque livrable doit pouvoir être lu et compris par :
- Le décideur (CEO/CMO) qui valide les budgets
- Le chef de projet digital qui coordonne
- Le développeur qui implémente
- Le rédacteur qui produit le contenu

### 1.2 Règle de la première mention
- **Première occurrence** d'un terme technique dans un livrable → explication entre parenthèses ou en note
- **Occurrences suivantes** → le terme peut être utilisé seul
- Format recommandé : `PageRank interne (la "valeur" que Google attribue à chaque page selon les liens qu'elle reçoit)`

### 1.3 Niveaux de complexité

| Niveau | Public cible | Exemples de termes | Traitement |
|--------|-------------|-------------------|------------|
| **N1 — Basique** | Tout le monde | Indexation, mot-clé, backlink, trafic organique | Explication courte en parenthèses à la 1ère mention |
| **N2 — Intermédiaire** | Chef de projet / Marketing | PageRank, canonical, crawl budget, E-E-A-T | Explication + analogie si possible |
| **N3 — Avancé** | Technique / SEO interne | Obfuscation, surfeur raisonnable, LTR, shingles | Encadré explicatif dédié ou annexe glossaire |
| **N4 — Expert** | Jamais dans un livrable client | Damping factor, Jaccard distance, Rocchio expansion | Ne pas mentionner — reformuler en langage accessible |

### 1.4 Techniques pédagogiques à utiliser

1. **L'analogie** : Comparer à un concept du quotidien
   - PageRank → "Un système de votes entre pages : plus une page reçoit de liens de pages importantes, plus elle est considérée comme importante"
   - Crawl budget → "Le temps que Google accorde à visiter votre site — comme un inspecteur qui a un nombre limité de visites par jour"

2. **Le "concrètement"** : Après chaque explication technique, ajouter "Concrètement, cela signifie que..."
   - "La profondeur de crawl est de 4. Concrètement, il faut 4 clics depuis la page d'accueil pour atteindre cette page — Google la considère comme peu importante."

3. **Le chiffre parlant** : Traduire les métriques en impact business
   - "214 pages n'ont que 0 à 3 liens internes. Ces pages représentent 11 200 clics/mois — soit du trafic potentiel mal exploité."

4. **L'encadré "Pourquoi c'est important"** : Pour les concepts clés, ajouter un bloc qui explique l'impact business
   ```
   💡 Pourquoi c'est important ?
   L'obfuscation permet de réorienter la valeur SEO vers vos pages stratégiques
   sans supprimer les liens utiles aux utilisateurs. C'est comme fermer certaines
   portes dans un bâtiment pour guider les visiteurs vers les salles importantes.
   ```

5. **Le tableau avant/après** : Pour les recommandations, montrer l'état actuel vs l'état cible

6. **Le schéma mental** : Pour les concepts structurels (maillage, architecture), décrire un schéma visuel même en texte
   - "Imaginez votre site comme un arbre : la page d'accueil est le tronc, les catégories sont les branches principales, les pages produit sont les feuilles. Aujourd'hui, certaines feuilles ne sont rattachées à aucune branche."

### 1.5 Ce qu'il ne faut JAMAIS faire dans un livrable
- Utiliser un acronyme sans l'avoir défini au moins une fois
- Supposer que le client connaît les outils (Screaming Frog, Ahrefs, GSC...)
- Laisser un terme anglais non traduit sans explication
- Donner un chiffre technique sans le contextualiser (ex: "CLS de 0.34" → dire "CLS de 0.34, soit 3 fois au-dessus du seuil acceptable par Google")
- Utiliser du jargon entre experts quand une formulation simple existe

### 1.6 Structure type d'une section de livrable

```
## [Titre clair et parlant — pas de jargon]

**Constat** : [Description factuelle, chiffres clés, accessible]

💡 [Explication de la notion si nécessaire — 2-3 phrases max]

**Impact** : [Conséquence business — trafic, revenus, visibilité]

**Recommandation** : [Action concrète, priorisée, avec effort estimé]

📊 [Tableau ou données si pertinent]
```

---

## Partie 2 : Glossaire Pédagogique par Thème

> Chaque entrée contient : le terme, l'explication client-friendly, une analogie (si pertinente), et le niveau (N1-N4).

---

### 2.1 Architecture & Maillage Interne

| # | Terme | Explication client | Analogie | Niveau |
|---|-------|-------------------|----------|--------|
| 1 | **Maillage interne** | L'ensemble des liens entre les pages de votre propre site. La façon dont vos pages se connectent entre elles. | Les couloirs et escaliers d'un bâtiment qui permettent de circuler entre les pièces | N1 |
| 2 | **PageRank interne (PRi)** | La "valeur" que Google attribue à chaque page de votre site en fonction des liens qu'elle reçoit d'autres pages de votre site. Plus une page reçoit de liens de pages elles-mêmes importantes, plus elle est valorisée. | Un système de votes : chaque lien est un vote, et le vote d'une page importante compte plus | N2 |
| 3 | **Lien entrant (inlink)** | Un lien provenant d'une autre page de votre site qui pointe vers cette page. | Une porte d'entrée dans une pièce | N1 |
| 4 | **Lien sortant (outlink)** | Un lien sur cette page qui envoie le visiteur vers une autre page. | Une porte de sortie de la pièce | N1 |
| 5 | **Balance nette PRi** | La différence entre les liens reçus et les liens envoyés par une page. Si une page a 2 liens entrants mais 120 liens sortants, elle "donne" beaucoup plus de valeur qu'elle n'en reçoit. | Un compte bancaire : si vous recevez 2€ mais dépensez 120€, vous êtes en déficit | N2 |
| 6 | **Ancre de lien** | Le texte cliquable d'un lien. Ce texte aide Google à comprendre de quoi parle la page de destination. | L'étiquette sur une porte qui dit ce qu'il y a dans la pièce | N1 |
| 7 | **Profondeur de crawl** | Le nombre de clics nécessaires depuis la page d'accueil pour atteindre une page. Une page à profondeur 1 est à 1 clic, à profondeur 4 elle est à 4 clics. Plus une page est profonde, moins Google la considère comme importante. | L'étage d'un bâtiment : le rez-de-chaussée est le plus accessible, le 4ème étage beaucoup moins | N1 |
| 8 | **Page orpheline** | Une page qui n'est liée par aucune autre page du site. Google peut avoir du mal à la trouver et à la valoriser. | Une pièce sans porte — on ne peut y accéder que si on connaît l'adresse exacte | N2 |
| 9 | **Lien contextuel** | Un lien placé dans le contenu éditorial de la page (texte d'un article, description), par opposition aux liens de navigation, header ou footer. Les liens contextuels transmettent plus de valeur SEO. | Une recommandation personnelle vs un panneau publicitaire : la première a plus de poids | N2 |
| 10 | **Lien sitewide** | Un lien présent sur toutes les pages du site (navigation, header, footer). Il transmet peu de valeur unitaire car il est répété partout. | Un message diffusé par haut-parleur dans tout le bâtiment — tout le monde l'entend mais personne n'y prête attention | N2 |
| 11 | **Cocon sémantique** | Une structure de maillage où les pages sont organisées et reliées par proximité thématique. Les pages qui parlent de sujets proches se lient entre elles. | Un classeur avec des intercalaires thématiques où les fiches d'un même sujet sont rangées ensemble | N2 |
| 12 | **Silo** | Une organisation du site en grandes sections thématiques étanches, où chaque section a sa propre hiérarchie de pages. | Les rayons d'un supermarché : chaque rayon a ses propres étagères et on ne mélange pas les produits | N2 |
| 13 | **Topic cluster (grappe thématique)** | Un ensemble de pages organisées autour d'une page pilier centrale, avec des pages satellites qui traitent des sous-sujets et qui pointent toutes vers la page pilier. | Une étoile : la page pilier au centre, les pages satellites autour, toutes reliées au centre | N2 |
| 14 | **Page pilier (pillar page)** | La page principale d'un cluster thématique. Elle traite le sujet de manière large et reçoit des liens de toutes les pages satellites plus spécifiques. | Le sommaire d'un livre qui renvoie vers chaque chapitre | N2 |
| 15 | **Fil d'Ariane (breadcrumb)** | Le chemin de navigation affiché en haut d'une page (ex: Accueil > Crédit > Crédit auto). Aide les utilisateurs et Google à comprendre la structure du site. | Les petits cailloux du Petit Poucet : ils montrent le chemin parcouru | N1 |
| 16 | **Mega-menu** | Un menu de navigation large qui se déploie et affiche de nombreux liens simultanément. Utile pour l'utilisateur mais peut disperser la valeur SEO sur trop de pages. | Un plan du bâtiment avec toutes les pièces listées — pratique mais ça dilue l'attention | N1 |
| 17 | **Obfuscation de liens** | Technique qui consiste à rendre un lien cliquable pour l'utilisateur mais invisible pour Google. Permet de garder des liens utiles (mentions légales, espace client) sans leur transmettre de valeur SEO. | Cacher les portes de service : les employés savent où elles sont, mais les visiteurs sont guidés vers les pièces principales | N3 |
| 18 | **Nofollow** | Un attribut qu'on ajoute à un lien pour dire à Google "ne suis pas ce lien". Attention : la valeur SEO est quand même divisée entre tous les liens, même ceux en nofollow — elle est simplement perdue au lieu d'être transmise. | Distribuer des tickets de restaurant : le nofollow revient à jeter un ticket plutôt qu'à ne pas le distribuer | N3 |
| 19 | **Surfeur raisonnable** | Le modèle de Google (breveté en 2010) qui donne plus de poids aux liens sur lesquels les utilisateurs sont susceptibles de cliquer : un lien dans le contenu, bien visible, avec un texte explicite, transmet plus de valeur qu'un lien caché en bas de page. | Toutes les portes ne sont pas égales : la porte principale bien éclairée "vaut" plus que la porte de secours au sous-sol | N3 |
| 20 | **Approche "Sniper"** | Stratégie de maillage qui concentre les liens des pages les plus fortes vers un petit nombre de pages cibles prioritaires, plutôt que de distribuer les liens uniformément. | Au lieu d'arroser tout le jardin avec un tuyau, on concentre l'eau sur les plantes qui en ont le plus besoin | N3 |

### 2.2 SEO Technique

| # | Terme | Explication client | Analogie | Niveau |
|---|-------|-------------------|----------|--------|
| 21 | **Crawl / Exploration** | L'action de Google qui parcourt (visite) les pages de votre site pour en découvrir le contenu. Google envoie des "robots" qui suivent les liens de page en page. | Un inspecteur qui visite votre bâtiment pièce par pièce | N1 |
| 22 | **Indexation** | Le fait qu'une page soit enregistrée dans la base de données de Google. Une page non indexée n'apparaîtra jamais dans les résultats de recherche. | Être inscrit dans l'annuaire téléphonique : si vous n'y êtes pas, personne ne vous trouve | N1 |
| 23 | **Budget de crawl** | Le nombre de pages que Google accepte de visiter sur votre site dans un temps donné. Si votre site a beaucoup de pages inutiles, Google gaspille son budget sur celles-ci au lieu de visiter vos pages importantes. | Le temps limité de l'inspecteur : s'il perd du temps dans des placards vides, il ne visite pas les salles importantes | N2 |
| 24 | **Robots.txt** | Un fichier à la racine de votre site qui donne des instructions aux robots de Google : quelles sections visiter ou ne pas visiter. | Le panneau à l'entrée du bâtiment qui indique "accès autorisé" ou "accès interdit" pour chaque zone | N2 |
| 25 | **Sitemap XML** | Un fichier qui liste toutes les pages importantes de votre site et que vous soumettez à Google. C'est comme lui donner un plan. | Le plan du bâtiment remis à l'inspecteur pour qu'il sache quelles pièces existent | N1 |
| 26 | **Balise canonical** | Une indication dans le code d'une page qui dit à Google "la version officielle de ce contenu est à cette adresse". Utile quand un même contenu est accessible via plusieurs URLs. | Une redirection de courrier postal : "le vrai destinataire est à cette adresse" | N2 |
| 27 | **Meta robots / Noindex** | Une instruction dans le code d'une page qui dit à Google "ne mets pas cette page dans tes résultats de recherche". | Un panneau "privé — ne pas référencer" sur la porte d'une pièce | N2 |
| 28 | **Redirection 301** | Une redirection permanente : quand une ancienne URL est déplacée définitivement vers une nouvelle. Google transfère la valeur SEO de l'ancienne vers la nouvelle. | Un changement d'adresse définitif avec transfert de courrier | N1 |
| 29 | **Redirection 302** | Une redirection temporaire. Google peut ne pas transférer la valeur SEO car il considère que l'ancienne URL reviendra. | "Nous avons temporairement déménagé, on revient bientôt à l'ancienne adresse" | N2 |
| 30 | **Chaîne de redirections** | Quand une page redirige vers une autre, qui redirige vers une autre, etc. Chaque maillon de la chaîne fait perdre de la valeur SEO et ralentit l'accès. | Un courrier renvoyé de bureau de poste en bureau de poste avant d'arriver à destination | N2 |
| 31 | **Erreur 404** | Page introuvable. Le serveur répond que la page demandée n'existe pas. Si d'autres pages pointent vers une 404, les liens sont "cassés" et la valeur SEO est perdue. | Arriver devant une porte et trouver un mur — le passage n'existe plus | N1 |
| 32 | **Soft 404** | Une page qui affiche "contenu introuvable" à l'utilisateur mais qui renvoie un code 200 (succès) au lieu d'un vrai code 404 au serveur. Google détecte l'incohérence et pénalise. | Une porte étiquetée "Bureau du directeur" mais quand on l'ouvre, la pièce est vide | N3 |
| 33 | **Contenu dupliqué** | Quand le même contenu (ou très similaire) se retrouve sur plusieurs pages du site. Google ne sait pas quelle version valoriser et peut déclasser toutes les versions. | Photocopier le même document et le mettre dans 5 dossiers différents — l'archiviste ne sait plus lequel est l'original | N1 |
| 34 | **Balise title** | Le titre de la page tel qu'il apparaît dans les résultats de Google (l'onglet du navigateur). C'est l'un des facteurs SEO les plus importants. | Le titre sur la couverture d'un livre — c'est ce qui donne envie de cliquer | N1 |
| 35 | **Meta description** | Le texte de 155 caractères qui apparaît sous le titre dans les résultats Google. N'impacte pas directement le classement mais influence le taux de clic. | Le résumé en 4ème de couverture d'un livre | N1 |
| 36 | **Balises Hn (H1, H2, H3...)** | Les titres et sous-titres dans le contenu de la page. Le H1 est le titre principal, les H2 sont les sous-titres, etc. Ils structurent le contenu pour Google et les lecteurs. | La table des matières d'un document | N1 |
| 37 | **Attribut alt (texte alternatif)** | Le texte descriptif associé à une image. Il permet à Google de comprendre le contenu de l'image et est lu par les lecteurs d'écran pour l'accessibilité. | La légende sous une photo dans un magazine | N1 |
| 38 | **HTTPS / SSL** | Le protocole de sécurité qui chiffre les échanges entre le navigateur de l'utilisateur et votre site. Google favorise les sites en HTTPS. Le cadenas dans la barre d'adresse. | L'enveloppe scellée vs la carte postale : HTTPS chiffre le contenu du courrier | N1 |
| 39 | **Hreflang** | Une balise qui indique à Google en quelle langue est la page et pour quel pays elle est destinée. Indispensable pour les sites multilingues. | Un panneau "This page is in French, for France" qui aide Google à montrer la bonne version aux bons utilisateurs | N2 |
| 40 | **Navigation à facettes** | Les filtres de recherche sur un site (par prix, taille, couleur...) qui génèrent chacun une URL différente. Peut créer des milliers de pages quasi-identiques qui diluent la valeur SEO. | Un catalogue où chaque combinaison de filtres crée une nouvelle page — ça multiplie les pages inutiles | N2 |
| 41 | **Rendu JavaScript (JS SEO)** | Quand le contenu d'une page est généré par du code JavaScript côté navigateur. Google doit exécuter ce code pour voir le contenu, ce qui peut poser des problèmes d'indexation. | Un livre en kit à assembler : le lecteur doit le monter lui-même avant de pouvoir le lire | N3 |
| 42 | **SSR (Server-Side Rendering)** | Le serveur génère la page HTML complète avant de l'envoyer au navigateur. Google voit immédiatement tout le contenu. C'est la solution recommandée pour le SEO. | Un livre livré déjà relié et imprimé, prêt à lire | N3 |
| 43 | **Cloaking** | Pratique interdite par Google : montrer un contenu différent à Google et aux utilisateurs. À ne pas confondre avec l'obfuscation (qui masque la forme du lien, pas le contenu de la page). | Montrer un faux passeport au contrôle — si Google le détecte, c'est la pénalité | N3 |
| 44 | **Transition Rank** | Concept Google (2012) : quand vous faites un changement SEO, Google ne l'applique pas instantanément. L'effet est progressif et proportionnel à l'ampleur du changement. Plus le changement est brutal, plus Google prend son temps pour en mesurer l'effet. | La période d'essai d'un nouvel employé : on ne lui donne pas toutes les responsabilités le premier jour | N3 |
| 45 | **Google Search Console (GSC)** | L'outil gratuit de Google qui montre comment votre site performe dans les résultats de recherche : clics, impressions, position moyenne, erreurs d'indexation. | Le tableau de bord de votre véhicule : il vous dit à quelle vitesse vous roulez et s'il y a des alertes | N1 |
| 46 | **Screaming Frog** | Un logiciel qui simule le comportement de Google en parcourant toutes les pages de votre site. Il détecte les erreurs techniques, les liens cassés, les contenus dupliqués, etc. | Un inspecteur automatisé qui passe chaque pièce du bâtiment au peigne fin et rédige un rapport | N2 |
| 47 | **Logs serveur** | Les fichiers qui enregistrent chaque visite sur votre site, y compris celles de Google. Leur analyse révèle quelles pages Google visite réellement, à quelle fréquence, et lesquelles il ignore. | Le registre d'entrée du bâtiment : on sait qui est venu, quand, et quelles pièces ont été visitées | N3 |

### 2.3 Performance & Core Web Vitals

| # | Terme | Explication client | Analogie | Niveau |
|---|-------|-------------------|----------|--------|
| 48 | **Core Web Vitals (CWV)** | Les 3 indicateurs de performance que Google utilise pour évaluer l'expérience utilisateur sur votre site : vitesse de chargement (LCP), réactivité (INP), et stabilité visuelle (CLS). | Les 3 notes de l'inspecteur sanitaire d'un restaurant : propreté, service, qualité | N1 |
| 49 | **LCP (Largest Contentful Paint)** | Le temps que met l'élément principal de la page (souvent une image ou un titre) à s'afficher. Google veut moins de 2,5 secondes. | Le temps entre le moment où vous ouvrez la porte d'un magasin et celui où vous voyez les produits en rayon | N2 |
| 50 | **INP (Interaction to Next Paint)** | Le temps de réponse de la page quand l'utilisateur clique ou tape quelque chose. Google veut moins de 200 millisecondes. A remplacé le FID en mars 2024. | Le temps entre le moment où vous appuyez sur un bouton d'ascenseur et celui où les portes commencent à bouger | N2 |
| 51 | **CLS (Cumulative Layout Shift)** | Mesure la stabilité visuelle : quand des éléments de la page bougent pendant le chargement (un bouton qui se décale, une image qui pousse le texte). Google veut un score inférieur à 0,1. | Imaginez lire un journal dont les colonnes se déplacent pendant que vous lisez — c'est frustrant et ça fait cliquer au mauvais endroit | N2 |
| 52 | **TTFB (Time to First Byte)** | Le temps que met le serveur à commencer à répondre quand un navigateur demande une page. Idéalement sous 250ms. | Le temps entre votre commande au restaurant et le moment où le serveur vous apporte le premier plat | N3 |
| 53 | **PageSpeed Insights** | L'outil gratuit de Google qui mesure la performance de vos pages et donne un score sur 100, avec des recommandations d'amélioration. | Le contrôle technique de votre voiture : un bilan de santé avec les points à corriger | N1 |
| 54 | **Données terrain (Field Data / CrUX)** | Les mesures de performance collectées auprès des vrais utilisateurs de votre site via Chrome. C'est ce que Google utilise pour le classement. | Les avis de vrais clients du restaurant, pas l'inspection du critique culinaire | N2 |
| 55 | **Données labo (Lab Data)** | Les mesures de performance simulées par un outil dans des conditions contrôlées. Utiles pour diagnostiquer mais pas utilisées par Google pour le classement. | L'inspection du critique culinaire : conditions standardisées mais pas le vécu des vrais clients | N2 |
| 56 | **CDN (Content Delivery Network)** | Un réseau de serveurs répartis dans le monde qui stocke des copies de votre site. L'utilisateur reçoit la page depuis le serveur le plus proche de lui, ce qui accélère le chargement. | Des entrepôts Amazon répartis partout en France pour livrer plus vite | N2 |
| 57 | **Cache** | Le fait de stocker temporairement des éléments de votre site (images, scripts) dans le navigateur de l'utilisateur pour que les pages suivantes chargent plus vite. | Le réfrigérateur : les ingrédients fréquents sont déjà prêts, pas besoin d'aller au marché à chaque repas | N2 |
| 58 | **Lazy loading** | Technique qui consiste à ne charger les images et vidéos que lorsque l'utilisateur fait défiler la page jusqu'à elles, au lieu de tout charger d'un coup. | Ne servir le dessert que quand le client a fini le plat principal, pas tout en même temps | N2 |
| 59 | **Above the fold** | La partie de la page visible sans faire défiler. C'est la zone la plus importante car c'est ce que l'utilisateur voit en premier. | La vitrine d'un magasin : ce qu'on voit depuis la rue sans entrer | N1 |

### 2.4 Contenu & E-E-A-T

| # | Terme | Explication client | Analogie | Niveau |
|---|-------|-------------------|----------|--------|
| 60 | **E-E-A-T** | Les 4 critères de qualité selon Google : Expérience vécue, Expertise du sujet, Autorité reconnue, Fiabilité (Trust). Depuis décembre 2025, ces critères s'appliquent à toutes les requêtes concurrentielles, pas seulement les sujets sensibles. | Le CV d'un candidat : a-t-il l'expérience, les compétences, la réputation, et est-il digne de confiance ? | N1 |
| 61 | **YMYL (Your Money or Your Life)** | Les sujets qui peuvent impacter la santé, les finances ou la sécurité des utilisateurs (crédit, assurance, santé, juridique). Google applique des critères de qualité renforcés sur ces sujets. | Les professions réglementées : un médecin ou un banquier doit prouver ses qualifications, un blogueur cuisine moins | N2 |
| 62 | **Autorité topique (topical authority)** | Le fait d'être reconnu par Google comme expert sur un sujet donné, parce que vous avez publié de nombreux contenus de qualité interconnectés sur ce sujet. | Être LE spécialiste reconnu de votre quartier dans un domaine — tout le monde sait que c'est à vous qu'il faut s'adresser | N2 |
| 63 | **Cannibalisation** | Quand plusieurs pages de votre site ciblent le même mot-clé et se font concurrence entre elles dans les résultats Google. Google ne sait pas laquelle promouvoir. | Deux commerciaux de la même entreprise qui démarchent le même client — ils se gênent mutuellement | N2 |
| 64 | **Helpful Content System** | Le système de Google (depuis 2022) qui évalue si votre contenu est réellement utile pour les utilisateurs ou s'il a été créé principalement pour se positionner sur Google. | Google distingue le restaurant qui cuisine bien du restaurant qui ne fait que de la pub — seul le premier est recommandé | N2 |
| 65 | **Contenu IA** | Contenu généré par intelligence artificielle (ChatGPT, etc.). Google ne l'interdit pas mais exige qu'il soit utile, fiable et relu par un humain. Le "Scaled Content Abuse" (production massive de contenu IA de faible qualité) est pénalisé. | Utiliser une calculatrice est autorisé, copier-coller les réponses sans vérifier ne l'est pas | N2 |
| 66 | **Content pruning (élagage)** | Supprimer ou fusionner les pages de faible qualité ou qui ne génèrent aucun trafic, pour concentrer la valeur SEO sur les pages utiles. | Tailler un arbre : couper les branches mortes pour que les branches saines reçoivent plus de sève | N2 |
| 67 | **Learning to Rank (LTR)** | Le système d'apprentissage automatique de Google qui décide comment pondérer les différents critères de classement en fonction de chaque requête. Il n'y a pas de formule fixe — le poids de chaque critère varie selon le contexte. | Un jury qui adapte ses critères de notation selon le concours : un concours de cuisine ne note pas comme un concours de danse | N3 |
| 68 | **Intention de recherche** | Ce que l'utilisateur cherche réellement quand il tape une requête : s'informer, comparer, acheter, trouver un lieu. Votre page doit correspondre à l'intention dominante. | Quand quelqu'un entre dans un magasin, il faut comprendre s'il veut acheter, regarder ou demander un renseignement | N1 |

### 2.5 Données Structurées & Rich Results

| # | Terme | Explication client | Analogie | Niveau |
|---|-------|-------------------|----------|--------|
| 69 | **Données structurées (Schema.org)** | Du code ajouté dans vos pages qui dit explicitement à Google ce que contient la page (un produit, un article, un avis, une recette...) dans un format qu'il comprend directement. | Une étiquette normalisée sur un colis : le transporteur sait immédiatement ce qu'il contient, son poids, sa destination | N2 |
| 70 | **JSON-LD** | Le format recommandé par Google pour intégrer les données structurées. C'est un bloc de code invisible pour l'utilisateur mais lisible par Google. | L'étiquette code-barres sur un produit : invisible pour le client mais contient toutes les informations pour le système | N3 |
| 71 | **Rich results (résultats enrichis)** | Les résultats Google qui affichent plus d'informations que les résultats classiques : étoiles d'avis, prix, FAQ dépliable, images, etc. Obtenus grâce aux données structurées. | La différence entre une petite annonce texte et une annonce avec photo, prix et avis — la seconde attire plus l'attention | N1 |
| 72 | **Knowledge Panel** | L'encadré qui apparaît à droite des résultats Google avec les informations clés sur une entreprise, une personne ou un lieu. Alimenté par les données structurées, Wikidata et Google Business. | Votre fiche d'identité officielle sur Google — nom, photo, adresse, description | N1 |
| 73 | **FAQ structurée (FAQPage)** | Des données structurées qui permettent d'afficher vos questions/réponses directement dans les résultats Google, sous votre lien. Occupe plus d'espace visuel dans la SERP. | Un dépliant de FAQ attaché à votre carte de visite — les réponses sont visibles sans cliquer | N2 |

### 2.6 Visibilité IA & GEO

| # | Terme | Explication client | Analogie | Niveau |
|---|-------|-------------------|----------|--------|
| 74 | **AI Overviews (ex-SGE)** | Les réponses générées par l'IA de Google qui s'affichent en haut des résultats de recherche. Elles synthétisent les informations de plusieurs sites et réduisent les clics vers les sites sources. | Un assistant qui lit 10 articles pour vous et vous fait un résumé — vous n'avez plus besoin de lire les articles | N1 |
| 75 | **GEO (Generative Engine Optimization)** | L'optimisation de votre contenu pour être cité par les moteurs de recherche IA (Google AI Overviews, ChatGPT, Perplexity). Le successeur naturel du SEO traditionnel. | Passer du "être bien classé dans l'annuaire" à "être recommandé par le concierge IA" | N1 |
| 76 | **ChatGPT Search / Perplexity** | Des moteurs de recherche basés sur l'IA qui lisent des pages web et formulent des réponses en citant leurs sources. Si votre contenu est cité, vous gagnez en visibilité. | De nouveaux annuaires intelligents qui recommandent des sources — il faut y être mentionné | N1 |
| 77 | **Citabilité** | La capacité de votre contenu à être repris et cité par les IA. Un contenu bien structuré, factuel, avec des chiffres et des listes est plus facilement citable. | Un article scientifique bien formaté est plus souvent cité qu'un texte confus | N2 |
| 78 | **llms.txt** | Un fichier (comme robots.txt mais pour les IA) qui aide les modèles de langage à comprendre la structure et le contenu de votre site. Standard émergent. | Un guide d'accueil spécial pour les robots IA : "voici qui nous sommes et comment notre site est organisé" | N3 |
| 79 | **Crawlers IA** | Les robots d'exploration des entreprises d'IA (GPTBot pour OpenAI, PerplexityBot, ClaudeBot pour Anthropic) qui parcourent le web pour entraîner leurs modèles ou fournir des réponses. Vous pouvez les autoriser ou les bloquer. | De nouveaux inspecteurs qui visitent votre bâtiment — vous décidez lesquels vous laissez entrer | N2 |
| 80 | **Mentions de marque** | Les fois où votre marque est citée sur d'autres sites, forums, Wikipedia, même sans lien. Les IA utilisent ces mentions pour évaluer votre notoriété et vous recommander. | Votre réputation : plus on parle de vous (en bien), plus le concierge IA vous recommandera | N1 |

### 2.7 Métriques & KPIs

| # | Terme | Explication client | Analogie | Niveau |
|---|-------|-------------------|----------|--------|
| 81 | **Trafic organique** | Les visiteurs qui arrivent sur votre site depuis les résultats de recherche naturels (non payants) de Google. | Les clients qui entrent dans votre magasin parce qu'ils l'ont trouvé en se promenant, pas via une pub | N1 |
| 82 | **Impressions** | Le nombre de fois où votre page est apparue dans les résultats de recherche Google, même si personne n'a cliqué. | Le nombre de personnes qui ont vu votre vitrine en passant devant | N1 |
| 83 | **Clics** | Le nombre de fois où quelqu'un a cliqué sur votre résultat dans Google pour visiter votre page. | Le nombre de personnes qui sont entrées dans le magasin après avoir vu la vitrine | N1 |
| 84 | **CTR (taux de clic)** | Le pourcentage de personnes qui cliquent sur votre résultat par rapport au nombre qui l'ont vu. CTR = Clics ÷ Impressions. Un CTR faible signifie que votre titre/description n'est pas assez attractif. | Le taux de conversion de votre vitrine : combien de passants entrent dans le magasin | N1 |
| 85 | **Position moyenne** | Le classement moyen de votre page dans les résultats Google pour un ensemble de requêtes. Position 1 = premier résultat. Au-delà de la position 10, vous êtes en page 2 ou plus. | Votre rang dans un classement : 1er c'est le meilleur, au-delà de 10 vous êtes en page 2 | N1 |
| 86 | **Backlinks** | Les liens provenant d'autres sites web qui pointent vers le vôtre. C'est l'un des facteurs de classement les plus importants : chaque backlink est comme un "vote" de confiance d'un autre site. | Les recommandations d'autres professionnels : plus on vous recommande, plus Google vous fait confiance | N1 |
| 87 | **Domain Authority / Domain Rating** | Un score (sur 100) calculé par des outils SEO (Ahrefs, Moz) qui estime la puissance globale de votre site basée sur ses backlinks. Ce n'est pas un indicateur Google officiel mais une approximation utile. | La note de réputation de votre entreprise sur une échelle de 0 à 100 | N2 |
| 88 | **SERP (page de résultats)** | La page affichée par Google quand un utilisateur fait une recherche. Elle contient les résultats organiques, les annonces, les rich results, les AI Overviews, etc. | La vitrine de Google : c'est là que votre site doit apparaître | N1 |

---

## Partie 3 : Règles de Rédaction Spécifiques par Type de Livrable

### 3.1 Audit Technique
- Toujours expliquer les codes HTTP (200, 301, 404, 500) en termes simples
- Accompagner chaque problème détecté de son impact business estimé
- Prioriser visuellement (P1 rouge, P2 orange, P3 jaune) — le client doit voir immédiatement ce qui est urgent
- Inclure des captures d'écran annotées quand possible

### 3.2 Audit Maillage Interne
- Ne jamais parler de "damping factor" ou de "matrice de transition" au client
- Reformuler le PageRank en "valeur SEO transmise par les liens"
- Toujours accompagner les chiffres de distribution de leur impact : "97 pages ont 681 liens entrants chacune" → "97 pages de votre template (navigation, footer) captent une part disproportionnée de la valeur SEO, au détriment de vos pages de contenu"
- Pour l'obfuscation : expliquer le concept avant de recommander la technique

### 3.3 Audit de Contenu / E-E-A-T
- Toujours contextualiser E-E-A-T par rapport au secteur du client
- Pour les YMYL (finance, santé) : souligner les enjeux réglementaires en plus du SEO
- Ne pas utiliser "thin content" — dire "contenu insuffisant" ou "page avec trop peu de contenu"
- Donner des exemples concrets de bons contenus dans le même secteur

### 3.4 Audit Performance
- Toujours convertir les métriques techniques en expérience utilisateur : "LCP de 4,2s" → "Votre page met 4,2 secondes à afficher son contenu principal — les utilisateurs s'attendent à moins de 2,5 secondes"
- Rappeler l'impact business : "Chaque seconde de chargement supplémentaire = environ -7% de conversions" (source : Google/SOASTA)
- Utiliser le code couleur Google : vert (bon), orange (à améliorer), rouge (mauvais)

### 3.5 Rapport GEO / Visibilité IA
- Commencer par expliquer le concept : "Les moteurs de recherche changent — Google, ChatGPT et Perplexity génèrent désormais des réponses au lieu de simplement lister des liens"
- Quantifier l'impact prévu sur le trafic avec des fourchettes réalistes
- Éviter l'alarmisme tout en étant factuel sur les risques

---

## Partie 4 : Checklist Pédagogique de Validation d'un Livrable

Avant de livrer un audit ou une recommandation, vérifier :

### Format & Structure
- [ ] Chaque section a un titre clair et non-jargonneux
- [ ] Un executive summary de 5-10 lignes ouvre le document
- [ ] Les recommandations sont priorisées (P1/P2/P3) avec effort et impact estimés
- [ ] Un glossaire est inclus en annexe si le document dépasse 10 pages

### Pédagogie
- [ ] Chaque terme technique de niveau N2+ est expliqué à sa première mention
- [ ] Aucun terme de niveau N4 n'apparaît tel quel — il est reformulé
- [ ] Les acronymes sont tous développés au moins une fois (sauf les très courants comme URL, PDF)
- [ ] Chaque recommandation est accompagnée d'un "Pourquoi" et d'un "Impact attendu"
- [ ] Les chiffres techniques sont traduits en impact business

### Contextualisation
- [ ] Les benchmarks sont relatifs au secteur du client (pas des moyennes globales)
- [ ] Les exemples sont concrets et liés au site du client
- [ ] Les recommandations tiennent compte du CMS et des contraintes techniques du client
- [ ] Le niveau de détail est adapté au destinataire (direction vs technique)

### Honnêteté intellectuelle
- [ ] Les estimations d'impact sont conservatrices et sourcées
- [ ] Les limites de l'analyse sont mentionnées
- [ ] Les sources des benchmarks et données sont citées
- [ ] Quand il y a incertitude, c'est dit clairement ("estimation basée sur...", "sous réserve de...")

---

## Partie 5 : Formulations Types à Réutiliser

### Introductions de concepts
- "**[Terme]** — c'est-à-dire [explication en 1 phrase]."
- "[Explication accessible]. En SEO, on appelle ça le **[terme technique]**."
- "Pour faire simple, [explication] (techniquement, on parle de **[terme]**)."

### Transitions vers l'impact
- "Concrètement, cela signifie que..."
- "En termes de trafic et de business, l'impact est le suivant :"
- "Pourquoi est-ce important pour [nom du client] ?"

### Nuances et honnêteté
- "L'impact estimé est de [fourchette], sous réserve de [conditions]."
- "Cette estimation est basée sur [source/méthodologie]. Les résultats réels dépendront de [facteurs]."
- "Il n'existe pas de certitude absolue en SEO — Google modifie régulièrement ses algorithmes. Cependant, les bonnes pratiques ci-dessous sont consensuelles dans l'industrie."

### Vulgarisation de concepts complexes
- PageRank : "La valeur SEO que Google distribue entre vos pages via les liens internes"
- Crawl budget : "Le temps que Google consacre à explorer votre site"
- Obfuscation : "Rendre un lien cliquable pour l'utilisateur mais invisible pour Google, afin de concentrer la valeur SEO sur vos pages stratégiques"
- E-E-A-T : "Les critères de crédibilité selon Google : expérience, expertise, autorité et fiabilité"
- CWV : "Les 3 notes de performance que Google attribue à vos pages"

---

## Sources et références
- Google Search Quality Rater Guidelines (QRG) — pour les définitions E-E-A-T et YMYL
- Google Developers — Web Vitals (web.dev/vitals) — pour les seuils CWV
- Schema.org — pour les types de données structurées
- Babbar Masterclass (Peyronnet, janvier 2024) — pour les concepts avancés PageRank, LTR, surfeur raisonnable
- Abondance (Olivier Andrieu) — pour les définitions SEO francophones de référence
- Foxglove Partner — pour la technique d'obfuscation Base64
