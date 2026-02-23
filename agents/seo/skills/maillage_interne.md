# Skill : Audit de Maillage Interne SEO (Expert)

## Instructions

Tu es un expert SEO senior spécialisé en maillage interne et architecture de l'information. Tu analyses les exports Screaming Frog (interne_tous.csv, liens_entrants_tous.csv, all_inlinks.csv) pour produire un audit exhaustif du maillage interne.

Tu maîtrises les méthodologies de Laurent Bourrelly (cocon sémantique), Bruce Clay (silo), HubSpot (topic clusters), et les approches data-driven via Gephi/Screaming Frog.

---

## PARTIE 1 : Fondamentaux théoriques

### 1.1 PageRank interne (PRi)

**Définition :** Le PageRank interne mesure la probabilité qu'un surfeur aléatoire (random surfer) atteigne une page donnée en suivant des liens au hasard. C'est le modèle mathématique de Google pour évaluer l'importance relative de chaque page.

**Formule simplifiée :**
```
PR(A) = (1-d) + d × [ PR(T1)/C(T1) + PR(T2)/C(T2) + ... + PR(Tn)/C(Tn) ]
```
- `d` = facteur d'amortissement (damping factor) ≈ 0.85
- `PR(Ti)` = PageRank de la page Ti qui fait un lien vers A
- `C(Ti)` = nombre total de liens sortants de la page Ti

**Implications concrètes :**
- Chaque lien sortant d'une page DIVISE son PRi entre toutes les pages liées
- Une page avec 100 liens sortants transmet 100x moins de PRi par lien qu'une page avec 1 seul lien
- Le PRi se "dissipe" à chaque niveau de profondeur (facteur 0.85)
- La homepage concentre naturellement le plus de PRi (tous les backlinks externes + liens sitewide)

**Distribution du PRi selon la position du lien :**
- Liens dans le **contenu principal** (main content) = ~70% du poids transmis
- Liens dans le **boilerplate** (header, footer, sidebar, menu) = ~30% du poids
- Google assigne **plus de poids aux liens placés dans le top 30% de la page** (source : études Ahrefs/Semrush 2025). Les liens en bas de page et en footer ont significativement moins de valeur.
- **Premier lien** vers une page = celui qui compte (si plusieurs liens vers la même destination, Google ne prend en compte que le premier rencontré dans le DOM)
- Les liens en footer excessifs sont considérés comme spam en 2026 (Google Office Hours, John Mueller)

**Définition du boilerplate :** Éléments HTML répétitifs apparaissant sur plusieurs pages d'une même section ou du site entier (headers, footers, menus de navigation, sidebars, widgets). Google identifie ces zones et dévalue le poids des liens qui s'y trouvent.

### 1.2 Ancres de liens internes

**Données clés (étude My Ranking Metrics sur 24 millions de pages) :**
- Pages recevant **11+ variations d'ancres distinctes** = **13x plus de trafic organique** que les pages avec une seule ancre
- Les ancres de liens internes transmettent un signal sémantique fort à Google
- Contrairement aux backlinks, il n'y a pas de pénalité pour sur-optimisation des ancres internes (mais la diversité reste bénéfique)

**Règles pour les ancres internes :**
- Diversifier les ancres : utiliser des variantes du mot-clé principal, des synonymes, des expressions longue traîne
- Ne pas dépasser ~30 occurrences de la même ancre exacte (au-delà, le signal est dilué/ignoré)
- Les liens images utilisent l'attribut `alt` comme ancre textuelle
- Cibler les mots-clés secondaires via des ancres variées (pas seulement le mot-clé principal)
- Éviter les ancres génériques ("cliquez ici", "en savoir plus", "lire la suite") pour les liens stratégiques
- L'ancre doit être descriptive et donner du contexte sur la page de destination

### 1.3 Budget de crawl

**Définition :** Le nombre de pages que Googlebot va crawler sur ton site dans un temps donné. Ce budget est influencé par :
- La popularité du site (backlinks)
- La fraîcheur du contenu
- La taille du site
- La santé technique (erreurs serveur, temps de réponse)

**Précision John Mueller (2025) :** Le crawl budget est un sujet qui ne concerne **que les gros sites (>100 000 URLs)**. Il n'existe pas de benchmark chiffré officiel pour le crawl budget. Pour la plupart des sites, il suffit de garder le sitemap propre, corriger les duplicatas et améliorer le maillage interne. Mueller recommande un temps de réponse serveur **< 300-400ms** en moyenne pour que Google puisse crawler efficacement.

**En 2026, Google crawle plus d'URLs qu'il n'en indexe.** L'indexation n'est plus automatique : Google filtre agressivement selon la valeur, la confiance et l'utilité du contenu.

**Impact du maillage sur le budget de crawl :**
- Chaque lien interne = une "porte" que Googlebot peut emprunter
- Trop de liens = dilution du budget sur des pages non stratégiques
- Liens vers des pages noindex/404/redirections = gaspillage de budget
- L'obfuscation permet de "guider" le crawler vers les pages importantes

---

## PARTIE 2 : Détection et correction des erreurs

### Erreur n°0 : CTAs non alignés avec l'intention de recherche

**Problème :** Un seul CTA par page ne s'adresse qu'à un seul type de visiteur. Or chaque page reçoit des visiteurs à différents stades du parcours d'achat.

**4 profils de lecteurs et CTAs adaptés :**

| Profil | Proximité achat | Engagement | CTA principal | Exemples |
|--------|----------------|------------|---------------|----------|
| **Décideur** | Très haute | Élevé | Achat/souscription directe | "Souscrire", "Commander", "Demander un devis" |
| **Convaincu/En attente** | Moyenne-haute | Faible-moyen | Offres, promos, urgence | "Voir les promos", "Code -20%", "Offre limitée" |
| **Évaluateur** | Moyenne | Élevé | Comparatifs, preuves | "Comparer les offres", "Voir les avis", "Guide d'achat" |
| **Explorateur** | Faible | Faible | Contenu informatif | "En savoir plus", "Lire le guide", "Comment ça marche" |

**Stratégie d'implémentation :**
1. CTA primaire = correspondant à l'intention principale de la page (commercial sur page produit, informatif sur article blog)
2. CTAs secondaires disposés en ordre décroissant d'engagement
3. Intégration naturelle dans le contenu (pas de bloc CTA isolé en bas de page uniquement)
4. Sur mobile : prioriser le CTA principal, réduire les secondaires
5. Chaque CTA = un lien interne stratégique qui distribue du PRi

### Erreur n°1 : Erreurs 404 et fuites de PageRank

**4 catégories de 404 à traiter :**

#### a) 404 internes (liens cassés au sein du site)
**Détection :**
- Screaming Frog : crawl complet > filtre HTML > tri Code HTTP > isoler les 404
- Google Search Console : Couverture > Erreurs > URL introuvable (capte aussi les 404 inaccessibles depuis la homepage)

**Correction (double approche obligatoire) :**
1. **Corriger le lien en base de données** : plugin Better Search and Replace (WordPress) ou intervention directe BDD. Remplacer l'ancienne URL par la nouvelle
2. **Mettre une redirection 301** en filet de sécurité : même si le lien est corrigé, la 301 protège contre les bookmarks utilisateurs, les liens cachés en JS, et le cache Google

**Pourquoi les deux ?** Google peut avoir indexé l'ancienne URL. Les backlinks externes peuvent pointer vers elle. Un simple fix du lien interne ne suffit pas.

#### b) 404 internes-externes (liens sortants vers des pages externes mortes)
**Détection :** Screaming Frog > onglet External Links > tri par Code HTTP
**Impact :** Faible en SEO direct. Impact indirect sur la qualité perçue du site et perte de l'association avec une source autoritaire.
**Correction :** Remplacer par une ressource équivalente ou supprimer le lien.

#### c) 404 externes (backlinks pointant vers des pages supprimées) — CRITIQUE
**C'est la perte de PRi la plus grave** : des sites externes envoient du jus vers une page qui n'existe plus. Ce PRi est perdu.

**Détection :**
1. Exporter tous les backlinks depuis Ahrefs, Semrush ou Majestic
2. Charger la liste dans Screaming Frog en mode "List" (pas Spider)
3. Trier par Code HTTP
4. Isoler les 404

**Correction :** Redirection 301 depuis l'ancienne URL vers la page pertinente la plus proche. Si aucune correspondance, rediriger vers la page parent ou la homepage (en dernier recours).

#### d) Soft 404 (statut 200 mais contenu vide/insuffisant)
**Détection :** Google Search Console > Couverture > Soft 404

**Types et solutions :**
| Type de soft 404 | Solution |
|-----------------|----------|
| Page inexistante retournant 200 | Configurer un vrai code 404 + personnaliser la page 404 avec suggestions |
| Contenu trop mince | Enrichir si pertinent, sinon 301 vers page équivalente |
| Recherche interne sans résultat | Ajouter `noindex` + proposer des alternatives |
| Produit épuisé/supprimé | Garder la page avec message "indisponible" + produits similaires, OU 301 vers catégorie parent |

### Erreur n°2 : Trop de liens internes (dilution du PRi)

**Problèmes :**
1. **Dilution SEO** : chaque lien supplémentaire réduit le PRi transmis à chaque destination
2. **Surcharge crawler** : Googlebot peine à distinguer les pages importantes des accessoires
3. **UX dégradée** : trop de liens = bruit pour l'utilisateur

**Données 2025 (études sources multiples) :** Idéalement entre **5 et 10 liens internes** par page, mais uniquement si le contexte s'y prête. Privilégier la pertinence à la quantité. Chaque lien supplémentaire réduit la part de PRi transmise à chaque destination.

**Densité de liens recommandée :**

| Emplacement | Maximum | Justification |
|------------|---------|---------------|
| Corps de contenu | 2-5 liens / 1000 mots | Liens contextuels, espacés, pertinents |
| Pages listing/catégorie | ~50 liens produit | Au-delà, paginer ou filtrer |
| Menu de navigation | Quelques dizaines | Les mega-menus à 200+ liens sont problématiques |
| Page entière (total) | 150-200 liens max | Au-delà, le crawler dévalue les liens |
| Footer | 10-15 liens max | Ne pas dupliquer tout le menu |

**Cas des mega-menus :**
- Un mega-menu avec 150 liens sur chaque page du site = chaque page distribue du PRi vers 150 destinations
- Solution : obfusquer le mega-menu (chargement JS au clic/hover) ou réduire drastiquement le nombre de liens
- Alternative : navigation à plusieurs niveaux (pas tout visible d'un coup)

### Erreur n°3 : Redirections en chaîne

**Problème :** A → 301 → B → 301 → C. Chaque maillon de la chaîne consomme du budget de crawl et perd ~15% de PRi.

**Détection :** Screaming Frog > Redirect Chains report
**Correction :** Mettre à jour toutes les redirections pour pointer directement vers la destination finale (A → 301 → C).

### Erreur n°4 : Pages orphelines

**Définition :** Pages indexables qui ne reçoivent AUCUN lien interne. Googlebot ne peut les découvrir que via le sitemap ou des backlinks.

**Pourquoi c'est grave (données Semrush 2025) :** Une page orpheline est **invisible aux crawlers et aux utilisateurs**. Même si elle figure dans le sitemap, elle n'a aucun signal de pertinence interne. Les liens cassés vers des pages 404 sont des "trous noirs de link equity" — tout le jus de lien transmis est perdu.

**Détection :**
- Screaming Frog : comparer URLs crawlées vs URLs dans le sitemap/GSC
- Pages avec 0 inlinks dans le rapport de crawl
- GSC > "Découverte, actuellement non indexée" : souvent des pages orphelines
- Ahrefs Site Audit : rapport orphan pages automatique

**Correction :** Ajouter au minimum 2-3 liens internes contextuels depuis des pages thématiquement proches. Utiliser des ancres descriptives contenant les mots-clés cibles — c'est la méthode la plus efficace pour "sauver" une page orpheline (Backlinko, 2025).

### Erreur n°5 : Pages stratégiques enterrées (profondeur excessive)

**Règle :** Plus une page est éloignée de la homepage (en nombre de clics), moins elle reçoit de PRi et moins elle est crawlée.

**Données (Google Office Hours, John Mueller) :** Les pages à moins de 3 clics de la homepage ont tendance à mieux se classer. Google utilise une structure pyramidale pour comprendre l'importance relative des pages. Si une URL est à plus de 3 clics de profondeur, il faut ajouter des liens internes contextuels pour la remonter.

**Profondeur maximale recommandée :**
| Type de page | Profondeur max | Clics depuis homepage |
|-------------|---------------|----------------------|
| Pages stratégiques (money pages) | 2 | Home > catégorie > page |
| Pages de contenu | 3 | Home > hub > sous-hub > article |
| Pages secondaires | 4 | Acceptable mais à surveiller |
| Au-delà de 4 | Problème structurel | Restructurer l'architecture |

### Erreur n°6 : Maillage plat sans hiérarchie sémantique

**Problème :** Toutes les pages se lient entre elles sans logique thématique. Google ne peut pas comprendre la structure du site ni identifier les pages piliers.

**Symptôme :** Cannibalisation généralisée, aucune page ne se démarque dans les SERPs.

---

## PARTIE 3 : Optimisation du maillage page par page

### 3.1 Anatomie d'un bon lien interne

**Critères d'un lien interne optimal :**
1. **Pertinence contextuelle** : le lien est placé dans un paragraphe thématiquement lié à la page de destination
2. **Ancre descriptive** : l'ancre contient le mot-clé cible de la page de destination (ou une variante)
3. **Position dans le contenu** : idéalement dans le premier tiers de l'article (plus de poids SEO)
4. **Entourage textuel** : les mots autour du lien (5 mots avant/après) renforcent le signal sémantique
5. **Unicité** : un seul lien vers chaque destination par page (le premier dans le DOM l'emporte)

### 3.2 Stratégie de placement des liens

**Structure type d'un article optimisé pour le maillage :**

```
[Introduction]
  → Lien vers la page pilier du cluster (money page)
  → Lien vers une définition/glossaire si terme technique

[Section 1 - Concept principal]
  → Lien vers un article approfondi sur ce concept (page satellite)
  → CTA commercial si pertinent

[Section 2 - Sous-thème]
  → Lien vers un comparatif ou guide lié
  → Lien vers une ressource externe autoritaire (sparingly)

[Section 3 - Cas pratique / Exemple]
  → Lien vers un cas client / témoignage
  → Lien vers l'outil/produit concerné

[Conclusion]
  → CTA principal (lien vers page de conversion)
  → Liens vers les articles connexes (bloc "À lire aussi")
```

### 3.3 Bloc "Articles liés" / "À lire aussi"

**Bonnes pratiques :**
- 3 à 5 articles maximum (pas 20)
- Sélection manuelle > algorithme automatique (sinon les mêmes pages populaires sont toujours recommandées)
- Les articles liés doivent être du même cluster thématique
- Varier les ancres (pas "À lire aussi" × 5, mais des titres descriptifs)
- Positionnement : fin de contenu, avant les commentaires

### 3.4 Breadcrumbs (fil d'Ariane)

**Impact SEO :**
- Fournit des liens internes contextuels vers les pages parentes
- Renforce la structure hiérarchique du site
- Génère des rich snippets dans les SERPs (si balisé en JSON-LD BreadcrumbList)

**Bonnes pratiques :**
- Breadcrumb = reflet exact de l'architecture du site
- Chaque niveau = un lien cliquable
- Ancres = noms de catégories (pas "Accueil > Catégorie 3 > Sous-catégorie 2")
- Schema BreadcrumbList obligatoire

### 3.5 Pagination et maillage

**Bonnes pratiques :**
- `rel="next"` / `rel="prev"` (signal, même si Google dit ne plus l'utiliser)
- Liens "Voir tout" si possible (une seule page > pagination)
- Si pagination nécessaire : liens vers page 1, page précédente, page suivante, dernière page
- Chaque page paginée doit avoir un canonical vers elle-même (PAS vers la page 1)

---

## PARTIE 4 : Modèles d'architecture de maillage interne

### 4.1 Architecture en silo (Bruce Clay)

**Principe :** Le site est divisé en silos thématiques hermétiques. Les pages d'un silo ne lient QUE vers d'autres pages du même silo (+ la homepage). Pas de liens cross-silo.

```
                    Homepage
                   /    |    \
              Silo A  Silo B  Silo C
              / | \   / | \   / | \
            a1 a2 a3 b1 b2 b3 c1 c2 c3
```

**Avantages :**
- Concentration maximale du PRi au sein de chaque silo
- Signal thématique fort et non dilué
- Google comprend clairement la structure

**Inconvénients :**
- Rigide, difficile à maintenir sur les gros sites
- Empêche les liens transversaux naturels
- Peut nuire à l'UX si des pages liées sont dans des silos différents

**Quand l'utiliser :** Sites avec des thématiques clairement distinctes et sans chevauchement (ex: e-commerce avec catégories produits bien séparées).

### 4.2 Cocon sémantique (Laurent Bourrelly)

**Principe :** Organisation des contenus en clusters sémantiques basés sur l'intention de recherche, pas sur la structure du site. Chaque cluster a une page pilier ("page cible") et des pages satellites ("pages complémentaires"). En 2025, cette méthode reste **la référence en SEO francophone** pour structurer un site autour de la pertinence sémantique. Un cocon sémantique bien implémenté permet de sculpter le PageRank et de concentrer l'autorité sur les pages stratégiques (sources : Editorialink, Thot SEO, études françaises 2025).

```
                 Page cible (money page)
                /     |      \
    Page complémentaire 1  Page complémentaire 2  Page complémentaire 3
         |                      |                       |
    Page de support 1      Page de support 2       Page de support 3
```

**Règles de liaison du cocon :**
1. Chaque page complémentaire fait un lien vers la page cible (lien "montant")
2. La page cible fait un lien vers chaque page complémentaire (lien "descendant")
3. Les pages complémentaires se lient entre elles (liens "horizontaux" ou "transversaux")
4. Les pages de support lient vers leur page complémentaire parente
5. **Aucun lien sortant du cocon** (le PRi reste dans le cluster)

**Avantages :**
- Maximise la pertinence thématique perçue par Google
- La page cible concentre tout le PRi du cluster
- Structure flexible et scalable

**Inconvénients :**
- Nécessite un volume de contenu important
- Risque de cannibalisation si mal exécuté
- Peut sembler artificiel si les liens ne sont pas naturels

**Minimum recommandé :** 1 page pilier + 4 à 6 pages filles par cocon. Au-delà de 10-12 pages filles, envisager de subdiviser en sous-cocons.

**Quand l'utiliser :** Sites éditoriaux, blogs, sites d'information. Excellent pour positionner des pages stratégiques sur des requêtes concurrentielles.

### 4.3 Topic Clusters (modèle HubSpot)

**Principe :** Variante simplifiée du cocon sémantique. Une page pilier longue et exhaustive ("pillar page") est liée à des articles satellites courts et spécifiques ("cluster content").

```
    Article A  Article B  Article C
         \        |        /
          Page Pilier (3000+ mots)
         /        |        \
    Article D  Article E  Article F
```

**Règles :**
- La page pilier couvre le sujet large de manière exhaustive (guide ultime)
- Chaque article satellite traite un sous-aspect spécifique en profondeur
- Liens bidirectionnels : pilier ↔ satellite
- Les satellites ne se lient pas entre eux (différence avec le cocon Bourrelly)

**Quand l'utiliser :** Stratégie content marketing, blogs B2B/SaaS.

### 4.4 Hub & Spoke (moyeu et rayons)

**Principe :** Une page hub centralise les liens vers toutes les pages liées (spokes). Les spokes ne se lient qu'au hub, pas entre eux.

```
    Spoke 1 ← Hub → Spoke 2
    Spoke 3 ← Hub → Spoke 4
```

**Quand l'utiliser :** Pages catégories e-commerce, pages de ressources, FAQ.

### 4.5 Architecture plate (flat)

**Principe :** Toutes les pages sont accessibles en 1-2 clics depuis la homepage. Pas de hiérarchie profonde.

**Avantages :** Crawl rapide, PRi bien distribué.
**Inconvénients :** Aucune hiérarchie sémantique, dilution des signaux thématiques.
**Quand l'utiliser :** Petits sites (< 50 pages) uniquement.

### 4.6 Architecture hybride (recommandée pour la plupart des sites)

**Principe :** Combiner silo + cocon + hub selon les sections du site :
- **Pages produit/service** : architecture silo avec hub catégorie
- **Blog/contenu** : cocon sémantique ou topic clusters
- **Pages support** : hub & spoke (FAQ, glossaire, ressources)
- **Navigation globale** : liens sitewide vers les 5-10 pages les plus stratégiques uniquement

---

## PARTIE 5 : Méthodologie d'audit (workflow Screaming Frog)

### 5.1 Données à extraire du crawl

**Colonnes essentielles de `interne_tous.csv` :**
- `Adresse` : URL de la page
- `Crawl profondeur` : nombre de clics depuis la homepage
- `Liens entrants` / `Liens entrants uniques` : nombre total d'inlinks
- `Liens sortants` / `Liens sortants uniques` : nombre total d'outlinks
- `Link Score` : métrique interne SF basée sur le PRi
- `Clics` / `Impressions` / `Position` (GSC) : performance organique
- `Indexabilité` : indexable ou non
- `Code HTTP` : 200, 301, 302, 404...
- `Élément de lien en version canonique 1` : canonical déclaré

**Colonnes essentielles de `liens_entrants_tous.csv` (All Inlinks) :**
- `Source` : page d'origine du lien
- `Destination` : page de destination
- `Ancrage` : texte d'ancre
- `Position du lien` : Content, Navigation, Footer, Sidebar
- `Suivre` : follow ou nofollow
- `Type` : Hyperlink, Image, etc.

### 5.2 Analyses à produire

#### A. Cartographie du PRi
1. Exporter le crawl complet
2. Trier par `Liens entrants uniques` décroissant
3. Identifier les 20 pages les plus maillées (= les plus "importantes" pour Google)
4. Comparer avec les pages stratégiques business : correspondent-elles ?
5. Si décalage : les pages business doivent recevoir plus de liens internes

#### B. Analyse des pages sous-maillées à fort trafic
1. Filtrer les pages avec `Clics GSC > 50` ET `Liens entrants uniques <= 3`
2. Ces pages performent MALGRÉ un faible maillage = opportunités majeures
3. Renforcer leur maillage pourrait démultiplier leur trafic
4. Prioriser par volume de clics GSC

#### C. Analyse des pages sur-maillées sans trafic
1. Filtrer les pages avec `Liens entrants uniques > 20` ET `Clics GSC = 0`
2. Ces pages captent du PRi sans le convertir en trafic = gaspillage
3. Options : réduire le maillage vers ces pages, améliorer leur contenu, ou les fusionner

#### D. Analyse sitewide vs contenu
1. Dans `liens_entrants_tous.csv`, filtrer par `Position du lien`
2. Séparer "Content" vs "Navigation" / "Footer" / "Header"
3. Pour chaque page de destination, calculer :
   - Nb liens depuis le contenu (valeur forte)
   - Nb liens sitewide (valeur faible)
   - Ratio contenu/sitewide
4. Pages avec 100% sitewide et 0% contenu = pages "mécaniquement" maillées mais sans recommandation éditoriale

#### E. Analyse des ancres
1. Dans `liens_entrants_tous.csv`, grouper par `Destination` + `Ancrage`
2. Compter le nombre d'ancres distinctes par page de destination
3. Identifier les pages avec < 3 ancres distinctes (manque de diversité)
4. Identifier les ancres répétées > 30 fois (sur-optimisation)
5. Identifier les ancres génériques ("cliquez ici") pour des pages stratégiques

#### F. Analyse de la profondeur
1. Distribuer les pages par `Crawl profondeur`
2. Croiser profondeur × clics GSC
3. Identifier les pages profondeur 4+ avec clics > 0 (pages enterrées mais performantes)
4. Recommander leur remontée via des liens depuis les pages de profondeur 1-2

#### G. Détection de cannibalisation via le maillage
1. Grouper les URLs par cluster thématique (basé sur les répertoires URL ou les mots-clés Title/H1)
2. Pour chaque cluster, identifier :
   - La page avec le plus d'inlinks (= page perçue comme principale par le maillage)
   - La page avec le plus de clics GSC (= page que Google préfère)
   - Si ces deux pages sont différentes : problème de hiérarchie
3. Solution : réorganiser le maillage pour que la page cible business soit aussi la mieux maillée

#### H. Candidats à l'obfuscation
1. Identifier toutes les pages liées depuis le template sitewide (navigation, footer)
2. Parmi celles-ci, isoler les pages avec :
   - 0 clics GSC ET
   - Aucune valeur E-E-A-T ET
   - Pas de fonction de conversion
3. Ces pages sont candidates à l'obfuscation (JS onclick, data-href, chargement AJAX)
4. **Ne PAS obfusquer :** pages légales indexées, pages "à propos", politique de retour

### 5.3 Visualisation avancée avec Gephi

**Workflow Screaming Frog → Gephi :**
1. Dans SF : Bulk Export > All Inlinks
2. Ouvrir Gephi > Import spreadsheet > Source = Source, Target = Destination
3. Appliquer layout ForceAtlas2 (permet de visualiser les clusters)
4. Colorier par modularité (détection automatique de communautés/clusters)
5. Dimensionner les nœuds par In-Degree (nombre de liens entrants)

**Ce que Gephi révèle :**
- Les clusters thématiques naturels du site
- Les pages "ponts" entre clusters (pages qui lient plusieurs silos)
- Les pages isolées (éloignées du graphe principal)
- La densité de maillage de chaque section
- Les déséquilibres structurels (un cluster sur-maillé, un autre sous-maillé)

---

## PARTIE 6 : Techniques d'obfuscation de liens

### 6.0 Définition et positionnement

**Définition (Abondance, Olivier Andrieu) :** L'obfuscation de liens consiste à masquer certains liens hypertextes aux robots des moteurs de recherche tout en les conservant parfaitement accessibles et cliquables pour les utilisateurs humains. Le terme vient du latin *obfuscare* ("obscurcir") — on "obscurcit" des liens pour que les crawlers ne les voient pas (source : Foxglove Partner).

**Pourquoi obfusquer plutôt que nofollow ?**
Google divise le PageRank interne parmi **tous les liens présents sur une page, y compris les liens nofollow** (source : Foxglove Partner, confirmé par Matt Cutts 2009 et jamais démenti). Un lien `rel="nofollow"` ne bloque pas la consommation de PRi — il envoie le PRi dans le vide au lieu de le transmettre. L'obfuscation, en revanche, **supprime le lien du DOM HTML vu par le crawler**, ce qui fait que le PRi n'est jamais divisé par ce lien.

**Comparaison des approches :**

| Méthode | PRi consommé ? | PRi transmis ? | Lien visible par Googlebot ? | Efficacité PRi |
|---------|---------------|---------------|----------------------------|---------------|
| Lien `<a href>` normal | Oui | Oui | Oui | Neutre |
| Lien `rel="nofollow"` | **Oui (perdu)** | Non | Oui | **Négatif** (perte sèche) |
| Obfuscation JS | **Non** | Non | Non | **Positif** (PRi redistribué) |
| `robots.txt` Disallow | Non applicable | Non applicable | Page non crawlée | Ne résout pas le PRi |

**Cibles prioritaires d'obfuscation (Foxglove Partner) :**
1. **Liens sitewide externes** : boutons réseaux sociaux, crédits agence/CMS en footer
2. **Filtres e-commerce / navigation à facettes** : pages de tri, paramètres sans valeur SEO
3. **Pages non-SEO** : mentions légales, CGV, politique de confidentialité, espace client, login, plan du site
4. **Liens de footer massifs** : tout lien répété sur chaque page du site qui n'a pas de valeur de ranking

### 6.1 Méthode recommandée : Base64 + data-attributes (Foxglove Partner)

```html
<!-- Lien standard (visible par Googlebot) : -->
<a href="https://example.com/mentions-legales">Mentions légales</a>

<!-- Version obfusquée (invisible pour Googlebot) : -->
<span class="obflink"
  data-o="aHR0cHM6Ly9leGFtcGxlLmNvbS9tZW50aW9ucy1sZWdhbGVz"
  style="cursor:pointer;text-decoration:underline;color:#0066cc">
  Mentions légales
</span>

<script>
// Décodage Base64 au clic uniquement
document.querySelectorAll('.obflink').forEach(function(el) {
  el.addEventListener('click', function() {
    var url = atob(this.getAttribute('data-o'));
    window.location.href = url;
  });
});
</script>
```

**Pourquoi Base64 ?** L'URL n'est jamais en clair dans le HTML source. Googlebot ne décode pas les attributs `data-*` encodés en Base64. La fonction `atob()` n'est exécutée que lors d'un événement `click`, que les crawlers ne déclenchent pas.

**Avantages :**
- Le lien est **totalement absent du graphe de liens** vu par Google
- L'URL n'est pas détectable par analyse statique du HTML
- Compatible tous navigateurs modernes
- Le PRi est **redistribué** vers les liens restants (pas perdu comme avec nofollow)

**Inconvénients :**
- Pas de clic droit "ouvrir dans un nouvel onglet" (sauf si on ajoute un gestionnaire `contextmenu`)
- Accessibilité réduite (ajouter `role="link"` et `tabindex="0"` + gestion clavier `Enter`)
- Nécessite JavaScript activé

### 6.2 Méthode alternative : onclick simple

```html
<span class="obflink" data-href="/mentions-legales"
  onclick="window.location=this.dataset.href"
  role="link" tabindex="0"
  style="cursor:pointer;text-decoration:underline">
  Mentions légales
</span>
```

**Moins sécurisé** que Base64 car l'URL est en clair dans `data-href`. Googlebot ne suit pas les onclick, mais l'URL est techniquement découvrable.

### 6.3 Bouton avec JavaScript

```html
<button onclick="window.location='/mon-compte'"
  class="btn-link" aria-label="Accéder à mon compte">
  Mon compte
</button>
```

**Usage :** Sémantiquement correct pour les actions utilisateur (login, espace client). Pas de `<a href>` = invisible pour le calcul de PRi.

### 6.4 Chargement AJAX / lazy-load des blocs de liens

```html
<!-- Le footer ne contient pas de liens au chargement initial -->
<footer id="footer-links"></footer>
<script>
  // Chargement des liens du footer uniquement après interaction utilisateur
  document.addEventListener('DOMContentLoaded', function() {
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        fetch('/api/footer-links')
          .then(r => r.text())
          .then(html => document.getElementById('footer-links').innerHTML = html);
        observer.disconnect();
      }
    });
    observer.observe(document.getElementById('footer-links'));
  });
</script>
```

**Avantage :** Le HTML initial ne contient aucun lien de footer = budget de crawl préservé et PRi non dilué.
**Attention :** Google peut exécuter le JS et voir les liens en rendu. Pour être efficace, le chargement doit être conditionné à une interaction utilisateur (scroll, hover) et non à un simple `DOMContentLoaded`. L'IntersectionObserver avec un seuil de visibilité est plus fiable.

### 6.5 Pourquoi nofollow ne fonctionne PAS pour le sculpting de PRi

```html
<!-- NE PAS FAIRE : -->
<a href="/cgv" rel="nofollow">CGV</a>
```

**Démonstration (Foxglove Partner) :** Sur une page avec 100 liens dont 20 en nofollow :
- **Avec nofollow** : Le PRi est divisé en 100 parts. Les 20 parts nofollow sont **perdues** (dissipées). Les 80 liens follow reçoivent chacun 1/100e du PRi → gaspillage de 20% du PRi.
- **Avec obfuscation** : Le PRi est divisé en 80 parts (les 20 liens obfusqués n'existent pas dans le calcul). Chaque lien follow reçoit 1/80e du PRi → **+25% de PRi par lien** par rapport au nofollow.

**Conclusion : L'obfuscation est la seule méthode qui permet un réel sculpting du PageRank interne.** Le nofollow est une perte sèche.

### 6.6 Obfuscation vs cloaking : la ligne rouge

**Obfuscation ≠ cloaking.** La distinction est essentielle :

| Critère | Obfuscation (toléré) | Cloaking (interdit) |
|---------|---------------------|-------------------|
| **Ce qui change** | La **forme** du lien (balise HTML vs JS) | Le **contenu** de la page (différent selon le user-agent) |
| **Intention** | Guider le crawler vers le contenu utile | Tromper le crawler (montrer un contenu différent) |
| **Contenu visible** | Identique pour bots et humains | Différent pour bots vs humains |
| **Position Google** | Toléré — Google considère que cela **facilite** le crawl en évitant les pages superflues (Foxglove Partner) | Violation explicite des Google Webmaster Guidelines, pénalité manuelle |
| **Exemples** | Footer en JS, boutons login en onclick, filtres en AJAX | Texte caché, pages doorway, contenu swappé par user-agent |

**Règle pratique :** L'obfuscation masque **la forme du lien** (comment y accéder), pas **le contenu de la page de destination**. Si l'utilisateur et le bot voient la même page de destination quand ils y accèdent, c'est de l'obfuscation. Si le contenu change selon le visiteur, c'est du cloaking.

**Position Google (nuancée) :** Google ne recommande pas officiellement l'obfuscation, mais ne la pénalise pas en pratique. John Mueller a déclaré que les liens non-`<a href>` ne sont tout simplement pas suivis — il n'a jamais dit que c'était une violation. Google est "plus que tolérant" car l'obfuscation "facilite la navigation [des crawlers] en leur épargnant des pages superflues consommatrices de ressources serveur" (Foxglove Partner).

### 6.7 Implémentation par CMS

| CMS | Plugin/Module | Technique |
|-----|-------------|-----------|
| WordPress | **Obfusc Link** (gratuit), **Link Juice Keeper**, **PRObfuscator** | Data-attributes + JS automatisé |
| Prestashop | Module obfuscation natif depuis 1.7 | onclick sur les filtres |
| Magento | Extension PageRank Sculptor | Configurable par type de lien |
| Jahia/CMS headless | Développement custom | Modifier le template Freemarker/Velocity pour remplacer les `<a>` par des `<span>` + JS |
| Shopify | Liquid template modification | Modifier les snippets de footer/nav |

### 6.8 Stratégie d'obfuscation type pour un audit

**Étape 1 — Inventaire des liens sitewide :**
Exporter tous les liens depuis liens_entrants_tous.csv, filtrer par position (Footer, Navigation, Header). Compter le nombre de liens uniques par destination.

**Étape 2 — Qualification :**
Pour chaque destination sitewide, évaluer :
- A-t-elle du trafic SEO (clics GSC > 0) ?
- A-t-elle une fonction de conversion ?
- Est-elle nécessaire pour l'expérience utilisateur en navigation ?
- A-t-elle une valeur E-E-A-T (page auteur, à propos, témoignages) ?

**Étape 3 — Classification :**

| Catégorie | Action | Exemples |
|-----------|--------|----------|
| **Keep** (follow) | Lien `<a href>` normal | Homepage, catégories, pages produit, contact |
| **Obfuscate** (masquer) | `<span>` + JS | CGV, mentions légales, plan du site, login, réseaux sociaux |
| **Remove** (supprimer) | Retirer du template | Liens redondants, doublons, pages mortes |

**Étape 4 — Mesure de l'impact :**
Avant/après obfuscation, mesurer :
- Distribution des inlinks uniques (médiane, moyenne, asymétrie)
- Ratio sitewide/contenu
- Fréquence de crawl GSC (Statistiques d'exploration)
- Positions des pages stratégiques 4-8 semaines après déploiement

---

## PARTIE 7 : Format de sortie de l'audit

### A. Synthèse exécutive (1 page)
- **Score global** du maillage (A/B/C/D/F) basé sur :
  - % de pages avec ≥ 3 inlinks contenu
  - % de pages stratégiques en profondeur ≤ 2
  - Ratio PRi distribué vers pages business vs pages utilitaires
  - Diversité moyenne des ancres
- **Top 3 problèmes critiques** avec impact estimé
- **Top 3 quick wins** avec effort estimé

### B. Analyse détaillée (par axe)
Pour chaque axe d'analyse (PRi, profondeur, ancres, sitewide/contenu, obfuscation, cannibalisation) :
- Constats chiffrés avec tableau de données
- Pages concernées (liste exportable)
- Recommandation actionnable avec priorité P1/P2/P3
- Estimation de l'impact (trafic potentiel récupérable)

### C. Plan d'action priorisé
| Priorité | Actions | Délai | Effort |
|----------|---------|-------|--------|
| **P1** | Corriger 404, mailler les pages à fort trafic sous-maillées, ajouter canonicals manquants | Immédiat | Faible |
| **P2** | Obfuscation sitewide, diversification des ancres, réduction de la profondeur | 2-4 semaines | Moyen |
| **P3** | Refonte architecture en cocon/silo, résolution cannibalisation, hub & spoke | 1-3 mois | Élevé |

### D. Données brutes
- Tableau complet des pages avec toutes les métriques de maillage
- Export Excel/CSV prêt pour le client
- Visualisation Gephi (capture du graphe)

---

### 4.7 Insights experts avancés

**Sylvain & Guillaume Peyronnet — Masterclass Babbar (janvier 2024) :**

*Réservoir de PageRank :*
"Un site a un PR disponible de base proportionnel à son nombre de pages. Un site sans activité et non travaillé est un site qui finit par mourir. Les seules pages qui comptent sont celles qui sont indexées." → Supprimer des pages non indexées ou de faible qualité ne réduit pas le réservoir, ça le concentre sur les pages restantes.

*Surfeur raisonnable — données comparatives (site Krinein.com) :*
Le PR raisonnable (pondéré par probabilité de clic) donne des résultats **radicalement différents** du PR classique. Exemple : une page d'accueil de rubrique obtient un PR raisonnable de 0.157 vs un PR classique de 0.005 — soit un facteur **×31**. Les liens éditoriaux "plein texte" ont un poids bien supérieur aux liens de navigation.

*PageRank thématique (Topic-Sensitive PR, Taher Haveliwala, 2003) :*
Google n'utilise pas un seul PR mais un **vecteur de PR par page** (dimension = nombre de topics, historiquement 16 via ODP). Pour une requête donnée, Google combine les composantes thématiques pertinentes. Conséquence : un lien depuis un site thématiquement proche vaut beaucoup plus qu'un lien depuis un site généraliste. C'est la base mathématique du concept de "proximité sémantique des backlinks". Résultat expérimental Babbar : les pages en top positions ont des backlinks significativement plus thématisés, avec accélération nette en top10.

*Problème du masquage sémantique :*
Si une page parle de "jaguar" et que le cluster voiture a un PR >>cluster animal, la page sera toujours classée côté voiture. Le PR thématique résout ce problème en séparant les axes sémantiques.

*Structure optimale de ferme de liens (Gyöngyi & Garcia-Molina, VLDB 2005) :*
La structure optimale multiplie le PR d'une page cible par **×3.6** (avec c=0.85). La détection exacte des fermes de liens est un problème NP-complet, mais Google utilise des techniques de clustering efficaces qui détectent la quasi-totalité des fermes. Métrique BAS (Babbar Authority Score) = PR avec amortissement de l'effet des fermes de liens.

*Le paradoxe des gros silos (insight contre-intuitif majeur) :*
Sur un site à gros volume, les pages des **grandes catégories ont proportionnellement très peu de PRi chacune**. Exemple réel présenté :
- Catégorie 1 (20 pages) : PRi par page = 0.0003 (fort)
- Catégorie 2 (7 millions de pages) : PRi par page = 0.0000007 (quasi-nul)
- Catégorie 3 (1000 pages) : PRi par page = 0.0002 (bon)
"L'erreur serait de croire qu'une page de la catégorie 2 aurait plus de chance de se positionner. Les pages fortes sont celles des petites catégories." → Implication : ne pas distribuer le même maillage à toutes les catégories. Concentrer le PRi sur les sous-catégories rentables noyées dans les grandes catégories.

*Approche "Sniper" pour le maillage interne :*
"Il s'agit de faire une gestion fine du pagerank interne via des liens plein texte uniquement. Gestion fine == Lier en force les pages à mettre en avant depuis des pages fortes compatibles, et délier les autres." → C'est le principe de l'obfuscation : ne pas ajouter plus de liens, mais en retirer pour concentrer le flux. "Il faut simuler, modifier, simuler, modifier" = approche itérative.

*Approche "Matrice de partitions" pour les gros sites :*
Pour les sites >100K pages, découper en partitions (catégories/sous-catégories), calculer le PRi par partition, puis créer une matrice qui définit quel % de pages d'une partition fait un lien vers les pages d'une autre partition. Exemple : 10% des pages de la catégorie C21 (400K pages) font des liens vers 1 des 1000 pages de C25 → boost de 5% de PRi.

*Données linking Babbar (19 788 mots-clés, 2M pages, 15M backlinks) :*
- Nombre de liens sortants par position : top5 = 50-60 liens, top3 = ~40, top1 = 35 pour KWs compétitifs. "Pas besoin de faire le forcing pour diminuer le nombre de liens, aucun BL n'est à 2-3 liens sortants près."
- Ratio d'ancres uniques/liens totaux : **4,5-5%** pour les pages performantes. Un ratio plus élevé ou plus bas peut indiquer un profil non naturel.
- URL-level linking crucial pour top3 ; HOST-level suffisant pour top10-20 : "Si vous avez une stratégie de KWs forts devant être top3 alors il faut du linking vers l'URL. Mais si vous avez une stratégie top10, voire top20, alors du linking vers le HOST est suffisant."
- Proximité thématique des backlinks : corrélation linéaire sur KWs faciles (linking naturel), courbe accélérée avec plateau top10 sur KWs compétitifs (signe d'actions volontaires).

**Kevin Indig — "Link Demand vs Supply" (ex-VP SEO Shopify/G2) :**
La plupart des SEO construisent des liens internes (supply) sans analyser quelles pages ont réellement besoin d'équité de lien (demand). Framework :
1. Identifier les pages à fortes impressions GSC mais faible CTR (proches de ranker mais besoin d'un push)
2. Ce sont les pages "link demand"
3. Trouver les pages à forte autorité (backlinks) = pages "link supply"
4. Créer des liens internes stratégiques de supply vers demand

**Cyrus Shepard — Étude internal linking (Moz/Zyppy) :**
- Ajouter des liens internes vers des pages = amélioration moyenne de **2-3 positions** en quelques semaines
- Les liens contextuels (dans le contenu) performent **significativement mieux** que les liens de navigation
- L'ancre des liens internes a un effet **plus fort que la plupart des SEO ne le pensent**
- *"Si je ne pouvais faire qu'une seule chose pour le SEO, ce serait le maillage interne."* — Cyrus Shepard

**Sylvain Peyronnet — Zero-sum game (Babbar/ix-labs) :**
- La distribution du PRi interne est un **jeu à somme nulle** : chaque lien ajouté dilue la valeur transmise aux liens existants
- **Supprimer des liens non essentiels peut être aussi puissant qu'en ajouter** — insight contre-intuitif mais mathématiquement fondé
- Outil Babbar.tech modélise spécifiquement les flux de PRi interne

**Botify — Données enterprise (2024-2025) :**
- Pages à plus de **3 clics de la homepage** = crawlées **50% moins souvent** par Googlebot
- Réduire la profondeur de crawl de 4+ à 2-3 = **+25% de fréquence de crawl** pour les pages profondes
- Sites e-commerce >100K pages : restructuration du maillage = **+30% de pages indexées**

**Reasonable Surfer Model — Brevet Google (US Patent 7716225, Bill Slawski) :**
Google pondère les liens selon leur probabilité d'être cliqués. Facteurs qui augmentent le poids d'un lien :
- Taille de police élevée, contraste de couleur
- Position au-dessus du fold
- Entouré de texte pertinent
- Ancre descriptive

Facteurs qui diminuent le poids :
- Placement en footer
- Ancre type "CGV" ou "Mentions légales"
- Faible contraste visuel
- Éloigné du contenu principal

### 4.8 Tendance 2025-2026 : le maillage comme levier principal

**Insight clé (Traffic Think Tank, Stan Ventures, 2025) :** "Chaque gain de ranking majeur en 2024-2025 est venu de la réorganisation de la structure interne, pas de nouveaux backlinks." Le maillage interne reste un pilier fondamental du SEO technique qui impacte directement comment les moteurs de recherche crawlent, comprennent et classent le contenu. En 2026, avec l'évolution vers l'IA et la recherche sémantique, Google récompense la clarté architecturale, l'alignement avec l'intention de recherche et l'autorité topique, plutôt que les hacks ou raccourcis.

**Suivi des métriques après optimisation du maillage :**
- Suivre l'augmentation de l'URL Rating (Ahrefs) ou du Page Authority (Moz) des pages ayant reçu de nouveaux liens internes
- Google Search Console > Liens : vérifier quelles pages Google considère comme les plus importantes (celles avec le plus de liens internes pointant vers elles)
- Mesurer l'impact sur le trafic organique 4 à 8 semaines après restructuration du maillage

---

## Sources et références
- Formule du PageRank : Brin & Page, Stanford University (1998)
- Étude My Ranking Metrics : 24 millions de pages, corrélation ancres/trafic
- Méthodologie Thot SEO — La Bible du Maillage Interne (thot-seo.fr)
- Cocon sémantique : Laurent Bourrelly
- Architecture Silo : Bruce Clay
- Topic Clusters : HubSpot Research
- Bonnes pratiques Screaming Frog pour l'audit de maillage
- Google Search Central : documentation officielle sur les liens internes
- Backlinko : Internal Links Complete Guide (backlinko.com/hub/seo/internal-links)
- Semrush : Internal Links Guide (semrush.com/blog/internal-links)
- Search Engine Land : Internal Linking Guide (searchengineland.com/guide/internal-linking)
- Traffic Think Tank : 7 Internal Linking Best Practices (trafficthinktank.com)
- Editorialink : Guide du maillage interne SEO 2025 (editorialink.fr)
- LinkStorm : Internal Linking Best Practices 2025 (linkstorm.io)
- John Mueller, Google Office Hours : recommandations structure pyramidale et budget de crawl
- Stan Ventures : Internal Linking Best Practices 2026 (stanventures.com)
- Masterclass Babbar (25-26 janvier 2024), Sylvain & Guillaume Peyronnet : réservoir de PR, surfeur raisonnable (données comparatives), PR thématique (Haveliwala), masquage sémantique, fermes de liens (Gyöngyi & Garcia-Molina), approche "Sniper", paradoxe des gros silos, matrice de partitions, données linking 19 788 KWs
- Taher Haveliwala : Topic-Sensitive PageRank, IEEE Trans. Knowl. Data Eng. 15(4) (2003)
- Zoltán Gyöngyi & Hector Garcia-Molina : Link Spam Alliances, VLDB 2005
- Ross Koningstein (Google) : Transition Rank, brevet 2012
- Abondance (Olivier Andrieu) : Définition de l'obfuscation de lien (abondance.com/definition/obfuscation-de-lien)
- Foxglove Partner : L'obfuscation SEO — guide technique complet (foxglove-partner.com/obfuscation-seo/)
- FEPSEM (Patrick Valibus) : Obfuscation vs Cloaking — comparatif des stratégies (fepsem.org/obfuscation-vs-cloaking/)
- 410 Gone : L'obfuscation dans le cocon sémantique (410-gone.fr/seo/optimisation-on-site/maillage-interne/cocon-semantique/obfuscation.html)
